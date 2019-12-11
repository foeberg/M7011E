const express = require('express');
const { authController, apiController } = require('../controllers');
const { ensureLoggedInManager, ensureLoggedInProsumer, ensureLoggedIn, ensureNotLoggedIn } = require('../utils');
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', ensureNotLoggedIn, authController.login);

router.post('/logout', ensureLoggedIn, authController.logout);

router.get('/householdImage', ensureLoggedInProsumer, apiController.getHouseholdImage);
router.post('/householdImage', ensureLoggedInProsumer, apiController.postHouseholdImage);

router.get('/activeSessions', ensureLoggedInManager, apiController.getActiveSessions);

router.get('/user', ensureLoggedIn, apiController.getUser);
router.post('/user', ensureLoggedIn, apiController.updateUser);

module.exports = router;