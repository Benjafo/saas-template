const express = require('express');
const { restrictTo } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

// All routes in this file are already protected by the authenticate middleware in server.js

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/preferences', userController.updatePreferences);

// User subscription routes
router.get('/subscription', userController.getSubscription);
router.post('/subscription/upgrade', userController.upgradeSubscription);
router.post('/subscription/downgrade', userController.downgradeSubscription);
router.post('/subscription/cancel', userController.cancelSubscription);

// User billing routes
router.get('/billing', userController.getBillingInfo);
router.patch('/billing', userController.updateBillingInfo);
router.get('/invoices', userController.getInvoices);

// Admin only routes
router.use(restrictTo('admin', 'super-admin'));
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
