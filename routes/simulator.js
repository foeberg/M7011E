const express = require('express');
const { simulatorController } = require('../controllers');
const router = express.Router();

var ensureLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        res.status(400);
        res.send('Not logged in');
        return;
    } else {
        next();
    }
};

router.get('/wind', simulatorController.getWind);

router.get('/householdConsumption/', ensureLoggedIn, simulatorController.getHouseholdConsumption);

router.get('/electricityPrice/', simulatorController.getElectricityPrice);

module.exports = router;