const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/logout', authController.logout); // Added logout route

// Protected routes
router.use(authenticate); // All routes after this middleware are protected
router.patch('/update-password', authController.updatePassword);
router.get('/me', authController.getMe);
router.patch('/update-me', authController.updateMe);
router.delete('/delete-me', authController.deleteMe);

module.exports = router;
