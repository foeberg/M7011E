const gaussian = require('gaussian');
const { Household, Powerplant, Consumption, Simdate } = require('../models/');
const config = require('../config.json');

class Simulator {
    constructor() {
        // The distribution for the wind speed of a whole day, wide distribution since wind can vary a lot from day to day.
        this.windDayDistribution = gaussian(0, 8*8);

        // Take a sample out of the day distribution, use it as a mean value in another distribution to simulate
        // wind changes during a day. Much smaller distribution since wind speeds over a day stay relatively the same.
        var daySample = this.windDayDistribution.ppf(Math.random());
        this.windHourDistribution = gaussian(daySample, 1);

        // Average swedish house annual consumption is 25 000 kWh, divided by amount of hours in a year
        // we get 2.85 kWh average consumtion per hour
        // http://www.energiradgivaren.se/2011/09/elforbrukning-i-en-genomsnittlig-villa-respektive-lagenhet/
        this.consumptionDistribution = gaussian(2.85, 0.5*0.5);

        this.households = []; 
        this.powerplant = null;
    }

    newDay() {
        var daySample = this.windDayDistribution.ppf(Math.random());
        this.windHourDistribution = gaussian(daySample, 1);
    }

    newHour() {
        let lastDay = this.date.getDate();
        this.date.setHours(this.date.getHours() + 1);
        let newDay = this.date.getDate();

        // If the day has changed after incrementing the hour, call newDay() as well
        if(newDay != lastDay) {
            this.newDay();
        }

        // Call the corresponding newHour in each household object
        for(var i = 0; i < this.households.length; i++) {
            // Send the old windspeed, since it currently also acts as the production of a household, and is needed
            // to update the buffer.
            this.households[i].newHour(this.getHouseholdProduction());
        }

        // Call the corresponding newHour in the powerplant object
        this.powerplant.newHour(this.households, this.getHouseholdProduction());

        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        // Update the date in the database
        this.dateObj.date = this.date;

        // Without this, the .save() only works the first time..
        this.dateObj.markModified('date');

        this.dateObj.save(function (err, c) {
            if (err) return console.error(err);
            console.log("date saved.");
        });
    }

    getWind() {
        return this.currentWind;
    }

    getHouseholds() {
        return this.households;
    }

    getHouseholdProduction() {
        return this.currentWind * 0.2;
    }

    addHousehold(household) {
        let newHousehold = new HouseholdClass(
            household.username,
            household.sellRatio,
            household.buyRatio,
            household.buffer,
            this.consumptionDistribution,
            this.dateObj,
            household
        );

        this.households.push(newHousehold);
    }

    getElectricityPrice() {
        var totalConsumption = 0;
        for(var i = 0; i < this.households.length; i++) {
            totalConsumption += this.households[i].currentConsumption;
        }

        var price = totalConsumption - this.currentWind;
        if(price < 0) {
            price = 0;
        }

        return price;
    }

    // Startup the simulator
    async start() {
        // Find the date the database should start up at from the database
        await Simdate.findOne(function(err, date) {
            if (err) {
                console.error(err);
                return;
            }
            // If a date doesn't exist in the database, insert a starting date.
            if(!date) {
                this.date = new Date('2020-01-01T12:00:00.000+00:00');
                this.dateObj = new Simdate({date: this.date});
                return;
            }
            this.date = new Date(date.date);
            this.dateObj = date;
        }.bind(this)).exec();

        // Create a household object for each household in the database
        await Household.find(function (err, households) {
            if (err) {
                console.error(err);
                return;
            }

            for(var i = 0; i < households.length; i++) {
                this.addHousehold(households[i]);
            }
        }.bind(this)).exec();

        // Create a powerplant object for the powerplant
        await Powerplant.findOne(function(err, plant) {
            if (err) {
                console.error(err);
                return;
            }
            // If no powerplant exist in database, we create one
            if(!plant) {
                var plant = new Powerplant();
            }
            this.powerplant = new PowerplantClass(plant);
            if(this.powerplant.getStatus() === 'Starting') {
                this.powerplant.plant.status = 'Stopped';
            }
        }.bind(this)).exec();

        // Get a new wind value from the distribution
        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        // Set the length of one hour in the simulation
        setInterval(function() {
            this.newHour();
        }.bind(this), config.simulator_hour_length);
    }
}

class HouseholdClass {
    constructor(username, sellRatio, buyRatio, buffer, distribution, dateObj, householdObj) {
        this.username = username;
        this.sellRatio = sellRatio;
        this.buyRatio = buyRatio;
        this.buffer = buffer;
        this.distribution = distribution;
        this.householdObj = householdObj;

        this.date = new Date(dateObj.date);
        this.currentConsumption = this.distribution.ppf(Math.random());

        this.blocked = false;
        this.blackout = false;
    }

    newHour(oldProduction) {
        this.blackout = false;
        this.date.setHours(this.date.getHours() + 1);
        // Update the buffer, based on the save and buy ratio, and the net production.

        // If the net production is below zero, decrease the buffer according to the buyRatio
        if(oldProduction - this.currentConsumption < 0.0) {
            this.buffer = Number(this.buffer - (this.currentConsumption - oldProduction) * (1.0 - this.buyRatio));

            // If the buffer couldn't provide enough energy, household gets a blackout
            if(this.buffer < 0.0) {
                this.buffer = 0.0;
                this.blackout = true;
            }
        } 

        // If the net production is above zero, increase the buffer according the the sellRatio
        else if(oldProduction - this.currentConsumption > 0.0) {
            this.buffer = Number(this.buffer + (oldProduction - this.currentConsumption)*(1.0 - this.getSellRatio()));
        }

        if(this.buffer > config.household_buffer_cap) {
            this.buffer = config.household_buffer_cap;
        }

        // Update buffer in database
        this.householdObj.buffer = this.buffer;
        this.householdObj.save((err) => {
            if(err) {
                console.error(err);
                return;
            }
        });

        // Get new value from the consumption distribution
        this.currentConsumption = this.distribution.ppf(Math.random());

        // Save the consumption in database, for over time statistic purposes.
        var currConsumption = new Consumption({
            householdUsername: this.username,
            consumption: this.currentConsumption,
            timestamp: this.date
        });

        currConsumption.save(function (err, c) {
            if (err) return console.error(err);
            console.log(c._id + " saved.");
        });
    }

    getSellRatio() {
        // If a manager has blocked the household from selling to market, the sellratio is 0
        if(this.blocked) {
            return 0.0;
        } else {
            return this.sellRatio;
        }
    }

    sellBlock(time) {
        this.blocked = true;

        setTimeout(function() {
            this.blocked = false;
        }.bind(this), time*1000);
    }
}

class PowerplantClass {
    constructor(plant) {
        this.plant = plant;

        this.startupTimer;
    }

    start() {
        // Return if already running
        if(this.plant.status === 'Running') return;

        this.plant.status = 'Starting';
        // It takes some time to start the powerplant
        this.startupTimer = setTimeout(function() {
            this.plant.status = 'Running';

            this.plant.save((err, plant) => {
                if(err) {
                    console.error(err);
                    return;
                }
            });
        }.bind(this), config.powerplant_startup_time);
    }

    stop() {
        if(this.plant.status === 'Stopped') return;

        this.plant.status = 'Stopped';
        this.plant.production = 0.0;
        clearTimeout(this.startupTimer);

        // Update database
        this.plant.save((err, plant) => {
            if(err) {
                console.error(err);
                return; 
            }
        });
    }

    getStatus() {
        return this.plant.status;
    }

    getProduction() {
        return this.plant.production;
    }

    setProduction(value) {
        this.plant.production = value;
    }

    newHour(households, householdProduction) {
        let plantProduction = this.plant.production * config.powerplant_max_production;
        // Send energy to the buffer
        this.plant.buffer += plantProduction * this.plant.bufferRatio;

        if(this.plant.buffer > config.powerplant_buffer_cap) {
            this.plant.buffer = config.powerplant_buffer_cap;
        }

        // The amount of energy sent to the market by the powerplant
        let marketEnergy = plantProduction * (1.0 - this.plant.bufferRatio);

        households.forEach(household => {
            household.blackout = false;

            // First check if the household has a positive net production
            let netProduction = householdProduction - household.currentConsumption;
            if(netProduction > 0.0) {
                // If so, add the amount they're selling to marketEnergy
                marketEnergy += netProduction * household.getSellRatio();
            } else {
                // If not, subtract the amount the household is buying from the market from marketEnergy
                let buyAmount = (household.currentConsumption - householdProduction) * household.buyRatio;
                
                // If the household buys more than the market can provide, take the rest from the plant buffer.
                if(buyAmount > marketEnergy) {
                    buyAmount -= marketEnergy;
                    marketEnergy = 0;
                    // If the buffer can't provide the rest of the energy, take from the house buffer.
                    if(buyAmount > this.plant.buffer) {
                        buyAmount -= this.plant.buffer;
                        this.plant.buffer = 0;
                        // If the house buffer can't provide the rest of the energy, the house gets a blackout
                        if(buyAmount > household.buffer) {
                            household.buffer = 0;
                            household.blackout = true;
                        } else {
                            household.buffer -= buyAmount;
                        }
                    } else {
                        this.plant.buffer -= buyAmount;
                    }
                } else {
                    marketEnergy -= buyAmount;
                }
            }
        });

        // Save powerplant state to database
        this.plant.save((err) => {
            if(err) {
                console.error(err);
                return;
            }
        });
    }

}

module.exports = Simulator;