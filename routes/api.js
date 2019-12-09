const express = require('express');
const { authController, apiController } = require('../controllers');
const { ensureLoggedInManager, ensureLoggedInProsumer, ensureLoggedIn, ensureNotLoggedIn } = require('../utils');
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', ensureNotLoggedIn, authController.login);

router.post('/logout', ensureLoggedIn, authController.logout);

router.get('/householdImage', ensureLoggedInProsumer, apiController.getHouseholdImage);
router.post('/householdImage', ensureLoggedInProsumer, apiController.postHouseholdImage);

router.get('/sellRatio', ensureLoggedInProsumer, apiController.getSellRatio);
router.post('/sellRatio', ensureLoggedInProsumer, apiController.postSellRatio);

router.get('/buyRatio', ensureLoggedInProsumer, apiController.getBuyRatio);
router.post('/buyRatio', ensureLoggedInProsumer, apiController.postBuyRatio);

router.get('/householdBuffer/', ensureLoggedInProsumer, apiController.getHouseholdBuffer);

router.get('/activeSessions/', ensureLoggedInManager, apiController.getActiveSessions);

module.exports = router;