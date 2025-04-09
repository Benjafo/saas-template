const express = require('express');
const configController = require('../controllers/config.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/subscription-plans', configController.getSubscriptionPlans);
router.get('/marketing-content', configController.getMarketingContent);

// Protected routes
router.get('/feature-flags', authenticate, configController.getFeatureFlags);

// Admin routes
router.get('/system-settings', authenticate, configController.getSystemSettings);

module.exports = router;
