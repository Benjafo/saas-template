const express = require('express');
const { restrictTo } = require('../middleware/auth.middleware');
const subscriptionController = require('../controllers/subscription.controller');

const router = express.Router();

// All routes in this file are already protected by the authenticate middleware in server.js

// User subscription management
router.get('/plans', subscriptionController.getAvailablePlans);
router.get('/current', subscriptionController.getCurrentSubscription);
router.post('/create-checkout-session', subscriptionController.createCheckoutSession);
router.post('/create-portal-session', subscriptionController.createPortalSession);

// Subscription actions
router.post('/upgrade', subscriptionController.upgradeSubscription);
router.post('/downgrade', subscriptionController.downgradeSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/reactivate', subscriptionController.reactivateSubscription);

// Subscription usage and limits
router.get('/usage', subscriptionController.getUsage);
router.get('/limits', subscriptionController.getLimits);

// Webhook handler (this should be public and handled separately in production)
router.post('/webhook', subscriptionController.handleWebhook);

// Admin only routes
router.use(restrictTo('admin', 'super-admin'));
router.get('/', subscriptionController.getAllSubscriptions);
router.patch('/:id', subscriptionController.updateSubscription);
router.post('/:id/override', subscriptionController.overrideSubscription);

module.exports = router;
