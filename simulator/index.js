var gaussian = require('gaussian');
var { Household, Consumption, Simdate } = require('../models/');

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
            this.households[i].newHour(this.currentWind);
        }

        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        // Update the date in the database
        this.dateObj.date = this.date;

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

    getElectricityPrice() {
        var totalConsumption = 0;
        for(var i = 0; i < this.households.length; i++) {
            totalConsumption += this.households[i].getConsumption();
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
            if (err) return console.error(err);
            this.date = new Date(date.date);
            this.dateObj = date;
        }.bind(this)).exec();

        // Create a household object for each household in the database
        await Household.find(function (err, households) {
            if (err) return console.error(err);

            for(var i = 0; i < households.length; i++) {
                this.households[i] = new HouseholdClass(households[i]._id,
                                                        households[i].sellRatio,
                                                        households[i].buyRatio,
                                                        households[i].buffer,
                                                        this.consumptionDistribution,
                                                        this.dateObj,
                                                        households[i]);
            }
        }.bind(this)).exec();

        // Get a new wind value from the distribution
        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        // Set the length of one hour in the simulation
        setInterval(function() {
            this.newHour();
        }.bind(this), 10000);
    }
}

class HouseholdClass {
    constructor(id, sellRatio, buyRatio, buffer, distribution, dateObj, householdObj) {
        this.id = id;
        this.sellRatio = sellRatio;
        this.buyRatio = buyRatio;
        this.buffer = buffer;
        this.distribution = distribution;
        this.householdObj = householdObj;

        this.date = new Date(dateObj.date);
        this.currentConsumption = this.distribution.ppf(Math.random());
    }

    getConsumption() {
        return this.currentConsumption;
    }

    newHour(oldProduction) {
        this.date.setHours(this.date.getHours() + 1);

        // Update the buffer, based on the save and buy ratio, and the net production.

        // If the net production is below zero, decrease the buffer according the the buyRatio
        if(oldProduction - this.getConsumption() < 0) {
            this.buffer = this.buffer - (this.getConsumption() - oldProduction)*(1 - this.buyRatio);

            if(this.buffer < 0) {
                this.buffer = 0;
            }
        } 
        // If the net production is above zero, increase the buffer according the the sellRatio
        else if(oldProduction - this.getConsumption() > 0) {
            this.buffer = this.buffer + (this.oldProduction - this.getConsumption)*(1 - this.sellRatio);
        }

        // Update buffer in database
        this.householdObj.buffer = this.buffer;
        this.householdObj.save((err, household) => {
            if(err) {
                console.error(err);
                return;
            }
            console.log('Buffer for ' + household.lastname + ' updated.');
        });

        // Get new value from the consumption distribution
        this.currentConsumption = this.distribution.ppf(Math.random());

        // Save the consumption in database, for over time statistic purposes.
        var currConsumption = new Consumption({
            householdId: this.id,
            consumption: this.currentConsumption,
            timestamp: this.date
        });

        currConsumption.save(function (err, c) {
            if (err) return console.error(err);
            console.log(c._id + " saved.");
        });
    }
}

module.exports = Simulator;