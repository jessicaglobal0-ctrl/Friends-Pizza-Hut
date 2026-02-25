const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Auth
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/google', authController.googleOAuth);
router.post('/facebook', authController.facebookOAuth);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
