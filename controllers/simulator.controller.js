const { Household, Powerplant } = require('../models');
const Simulator = require('../simulator/');
const sim = new Simulator();

sim.start();

const getWind = (req, res) => {
    res.send(sim.getWind().toString());
    return;
};

const getHouseholdConsumption = (req, res) => {
    let household = sim.getHouseholds().find(h => h.username === req.session.user.username);
    res.send(household.getConsumption().toString());
    return;
};

const getElectricityPrice = (req, res) => {
    res.send(sim.getElectricityPrice().toString());
    return;
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
module.exports = {
    getWind,
    getHouseholdConsumption,
    getElectricityPrice,
    sim
}