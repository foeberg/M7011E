const express = require('express');
const { authController, apiController } = require('../controllers');
const { ensureLoggedIn, ensureNotLoggedIn } = require('../utils');
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', ensureNotLoggedIn, authController.login);

router.post('/logout', ensureLoggedIn, authController.logout);

router.get('/householdImage', ensureLoggedIn, apiController.getHouseholdImage);
router.post('/householdImage', ensureLoggedIn, apiController.postHouseholdImage);

router.get('/sellRatio', ensureLoggedIn, apiController.getSellRatio);
router.post('/sellRatio', ensureLoggedIn, apiController.postSellRatio);

router.get('/buyRatio', ensureLoggedIn, apiController.getBuyRatio);
router.post('/buyRatio', ensureLoggedIn, apiController.postBuyRatio);

router.get('/householdBuffer/', ensureLoggedIn, apiController.getHouseholdBuffer);

module.exports = router;