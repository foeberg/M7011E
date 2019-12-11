const express = require('express');
const { authController, apiController } = require('../controllers');
const { ensureLoggedInManager, ensureLoggedInProsumer, ensureLoggedIn, ensureNotLoggedIn } = require('../utils');
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', ensureNotLoggedIn, authController.login);

router.post('/logout', ensureLoggedIn, authController.logout);

router.get('/profileImage', ensureLoggedIn, apiController.getProfileImage);
router.post('/profileImage', ensureLoggedIn, apiController.postProfileImage);

router.get('/prosumers', ensureLoggedInManager, apiController.getProsumers);

router.get('/user', ensureLoggedIn, apiController.getUser);
router.post('/user', ensureLoggedIn, apiController.updateUser);
router.delete('/user', ensureLoggedInManager, apiController.deleteUser);

module.exports = router;