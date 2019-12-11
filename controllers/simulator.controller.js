const { User, Household, Powerplant } = require('../models');
const Simulator = require('../simulator/');
const config = require('../config.json');
const sim = new Simulator();

sim.start();

const getWind = (req, res) => {
    res.send(sim.getWind().toString());
    return;
};

const getMarketDemand = (req, res) => {
    let households = sim.getHouseholds();
    let marketDemand = 0;
    let production = sim.getHouseholdProduction();
    households.forEach(household => {
        let consumption = household.currentConsumption;
        let householdDemand = 0;
        let netConsumption = consumption - production;
        if(netConsumption > 0) {
            householdDemand = netConsumption * household.buyRatio;
        }
        marketDemand += householdDemand;
    });
    res.send(marketDemand.toString());
    return;
};

const getHouseholdConsumption = (req, res) => {
    let household = sim.getHouseholds().find(h => h.username === req.session.user.username);
    res.send(household.currentConsumption.toString());
    return;
};

const getHouseholdProduction = (req, res) => {
    res.send(sim.getHouseholdProduction().toString());
    return;
};

const getProsumer = (req, res) => {
    let simHousehold = sim.getHouseholds().find(h => h.username === req.params.username);

    if(!simHousehold) {
        res.status(400).send('Prosumer not found');
        return;
    }

    User.findOne({ username: req.params.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting prosumer');
            return;
        } else {
            if(user.role !== 'prosumer') {
                res.status(400).send('User is not a prosumer.');
                return;
            } else {
                let data = {
                    username: user.username,
                    lastname: user.lastname,
                    production: sim.getHouseholdProduction(),
                    consumption: simHousehold.currentConsumption,
                    sellRatio: simHousehold.sellRatio,
                    buyRatio: simHousehold.buyRatio,
                    buffer: simHousehold.buffer
                };
                res.status(200).send(data);
                return;
            }

        }
    });
};

const getElectricityPrice = (req, res) => {
    res.send(sim.getElectricityPrice().toString());
    return;
};

const getManagerElectricityPrice = (req, res) => {
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.send(500).send('Error getting manager electricity price.');
            return;
        } else {
            res.send(plant.electricityPrice.toString());
            return;
        }
    });
};

const setManagerElectricityPrice = (req, res) => {
    if(req.body.electricityPrice == null || req.body.electricityPrice === '') {
        res.status(400).send('electricityPrice field not provided');
        return;
    }
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error setting manager electricity price');
            return;
        } else {
            plant.electricityPrice = req.body.electricityPrice;

            plant.save((err) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error saving manager electricity price.');
                    return;
                } else {
                    res.status(200).send('Saved manager electricity price.');
                }
            })
        }
    });
};

const getSellRatio = (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting sell ratio');
            return;
        } else {
            res.status(200).send(household.sellRatio.toString());
            return;
        }
    });
};

const postSellRatio = (req, res) => {
    if(req.body.sellRatio == null || req.body.sellRatio === '') {
        res.status(400).send('sellRatio field not provided');
        return;
    }
    Household.findOne({ username: req.session.user.username }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error setting sell ratio');
            return;
        } else {
            household.sellRatio = req.body.sellRatio;
            household.save((err, h) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error saving sell ratio');
                    return;
                } else {
                    // Update household in simulator
                    let household = sim.households.find(h => h.username === req.session.user.username);
                    household.sellRatio = h.sellRatio;

                    console.log('SellRatio for household "' + req.session.user.username + '" updated');
                    res.status(200).send('Sellratio updated');
                    return;
                }
            });
        }
    });
};

const getBuyRatio = (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting buy ratio');
            return;
        } else {
            res.status(200).send(user.buyRatio.toString());
            return;
        }
    });
};

const postBuyRatio = (req, res) => {
    if(req.body.buyRatio == null || req.body.buyRatio === '') {
        res.status(400).send('buyRatio field not provided');
        return;
    }
    Household.findOne({ username: req.session.user.username }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error setting buy ratio');
            return;
        } else {
            household.buyRatio = req.body.buyRatio;
            household.save((err, h) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error saving buy ratio');
                    return;
                } else {
                    // Update household in simulator
                    let household = sim.households.find(h => h.username === req.session.user.username);
                    household.buyRatio = h.buyRatio;

                    console.log('BuyRatio for household "' + req.session.user.username + '" updated');
                    res.status(200).send('Buyratio updated');
                    return;
                }
            });
        }
    });
};

const getHouseholdBuffer = (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting household buffer.');
            return;
        } else {
            res.status(200).send(household.buffer.toString());
            return;
        }
    });
};

const getPowerplantBuffer = (req, res) => {
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting powerplant buffer.');
            return;
        } else {
            res.status(200).send(plant.buffer.toString());
        }
    });
};

const getBufferRatio = (req, res) => {
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting powerplant buffer ratio.');
            return;
        } else {
            res.status(200).send(plant.bufferRatio.toString());
        }
    });
};

const setBufferRatio = (req, res) => {
    if(req.body.bufferRatio == null || req.body.bufferRatio === '') {
        res.status(400).send('bufferRatio field not provided');
        return;
    }
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error setting powerplant buffer ratio.');
            return;
        } else {
            plant.bufferRatio = req.body.bufferRatio;
            plant.save((err, h) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error saving powerplant buffer ratio.');
                    return;
                } else {
                    // Update powerplant in simulator
                    sim.powerplant.bufferRatio = h.bufferRatio;

                    console.log('bufferRatio for powerplant updated');
                    res.status(200).send('bufferRatio updated');
                    return;
                }
            });
        }
    });
};

const startPowerplant = (req, res) => {
    sim.powerplant.start();
    res.status(200).send('Starting powerplant.');
};

const stopPowerplant = (req, res) => {
    sim.powerplant.stop();
    res.status(200).send('Stopping powerplant.');
};

const getPowerplantStatus = (req, res) => {
    res.send(sim.powerplant.getStatus());
};

const getPowerplantProduction = (req, res) => {
    let productionRatio = sim.powerplant.getProduction();
    res.send({
        ratio: productionRatio,
        value: config.powerplant_max_production * productionRatio
    });
};

const setPowerplantProduction = (req, res) => {
    if(req.body.production == null || req.body.production === '') {
        res.status(400).send('production field not provided');
        return;
    }
    Powerplant.findOne((err, plant) => {
        if(err) {
            console.error(err);
            res.status(500).send('error setting powerplant production');
            return;
        } else {
            if(plant.status === 'Stopped') {
                res.status(400).send('Powerplant is not running.');
                return;
            }
            plant.production = req.body.production;
            plant.save((err, p) => {
                if(err) {
                    console.error(err);
                    return;
                } else {
                    // Update powerplant in simulator.
                    sim.powerplant.setProduction(p.production);

                    console.log('production for powerplant updated');
                    res.status(200).send('production updated');
                    return;
                }
            });
        }
    });
};

const getBlackouts = (req, res) => {
    let blackouts = [];
    let households = sim.getHouseholds();
    households.forEach(household => {
        if(household.blackout) {
            blackouts.push({
                username: household.username
            });
        }
    });
    res.status(200).send(blackouts);
};

module.exports = {
    getWind,
    getMarketDemand,
    getHouseholdConsumption,
    getHouseholdProduction,
    getElectricityPrice,
    getManagerElectricityPrice,
    setManagerElectricityPrice,
    getProsumer,
    getSellRatio,
    postSellRatio,
    getBuyRatio,
    postBuyRatio,
    getHouseholdBuffer,
    getPowerplantBuffer,
    getBufferRatio,
    setBufferRatio,
    startPowerplant,
    stopPowerplant,
    getPowerplantStatus,
    getPowerplantProduction,
    setPowerplantProduction,
    getBlackouts,
    sim
};