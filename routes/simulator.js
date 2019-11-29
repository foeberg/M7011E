const express = require('express');
const { simulatorController } = require('../controllers');
const { ensureLoggedIn } = require('../utils');
const router = express.Router();

router.get('/wind', simulatorController.getWind);

router.get('/householdConsumption/', ensureLoggedIn, simulatorController.getHouseholdConsumption);

router.get('/electricityPrice/', simulatorController.getElectricityPrice);

module.exports = router;