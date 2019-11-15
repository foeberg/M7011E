var gaussian = require('gaussian');
var { Household, Consumption, Simdate } = require('../models/');

class Simulator {
    constructor() {
        this.windDayDistribution = gaussian(0, 8*8);

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

        if(newDay != lastDay) {
            this.newDay();
        }

        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        for(var i = 0; i < this.households.length; i++) {
            this.households[i].newHour();
        }

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

    async start() {
        await Simdate.findOne(function(err, date) {
            if (err) return console.error(err);
            this.date = new Date(date.date);
            this.dateObj = date;
        }.bind(this)).exec();

        await Household.find(function (err, households) {
            if (err) return console.error(err);

            for(var i = 0; i < households.length; i++) {
                this.households[i] = new HouseholdClass(households[i]._id, this.consumptionDistribution, this.dateObj);
            }
        }.bind(this)).exec();

        this.newDay();
        this.newHour();
        setInterval(function() {
            this.newHour();
        }.bind(this), 10000);
    }
}

class HouseholdClass {
    constructor(id, distribution, dateObj) {
        this.id = id;
        this.distribution = distribution;
        this.date = new Date(dateObj.date);
    }

    getConsumption() {
        return this.currentConsumption;
    }

    newHour() {
        this.date.setHours(this.date.getHours() + 1);

        this.currentConsumption = this.distribution.ppf(Math.random());

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