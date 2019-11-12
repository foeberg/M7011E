var gaussian = require('gaussian');

class Simulator {
    constructor() {
        this.hourOfDay = 0;
        this.windDayDistribution = gaussian(0, 8*8);

        // Average swedish house annual consumption is 25 000 kWh, divided by amount of hours in a year
        // we get 2.85 kWh average consumtion per hour
        // http://www.energiradgivaren.se/2011/09/elforbrukning-i-en-genomsnittlig-villa-respektive-lagenhet/
        this.consumptionDistribution = gaussian(2.85, 0.5*0.5);

        this.households = [];

        Household.find(function (err, households) {
            if (err) return console.error(err);

            for(var i = 0; i < households.length; i++) {
                this.households[i] = new HouseholdClass(households[i]._id, this.consumptionDistribution);
        }
        }.bind(this));
        
    }

    newDay() {
        console.log("newDay");
        this.hourOfDay = 0;
        var daySample = this.windDayDistribution.ppf(Math.random());
        this.windHourDistribution = gaussian(daySample, 1);
    }

    newHour() {
        if(this.hourOfDay == 24) {
            this.newDay();
        }
        console.log("newHour");
        this.currentWind = Math.abs(this.windHourDistribution.ppf(Math.random()));

        for(var i = 0; i < this.households.length; i++) {
            this.households[i].newHour();
        }

        this.hourOfDay++;
    }

    getWind() {
        console.log("getWind");
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

    start() {
        this.newDay();
        this.newHour();
        setInterval(function() {
            this.newHour();
        }.bind(this), 10000);
    }
}

class HouseholdClass {
    constructor(id, distribution) {
        this.id = id;
        this.distribution = distribution;
    }

    getConsumption() {
        return this.currentConsumption;
    }

    newHour() {
        this.currentConsumption = this.distribution.ppf(Math.random());
    }

}

module.exports = Simulator;