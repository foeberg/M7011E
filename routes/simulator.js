const express = require('express');
const { simulatorController } = require('../controllers');
const { ensureLoggedInProsumer } = require('../utils');
const router = express.Router();

router.get('/wind', simulatorController.getWind);

router.get('/householdConsumption/', ensureLoggedInProsumer, simulatorController.getHouseholdConsumption);

router.get('/electricityPrice/', simulatorController.getElectricityPrice);

module.exports = router;