const express = require('express');
const { restrictTo } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// All routes in this file are already protected by the authenticate middleware in server.js
// Additionally, restrict all admin routes to admin and super-admin roles
router.use(restrictTo('admin', 'super-admin'));

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);
router.get('/revenue', adminController.getRevenueStats);
router.get('/users/growth', adminController.getUserGrowthStats);
router.get('/subscriptions/distribution', adminController.getSubscriptionDistribution);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/impersonate', adminController.impersonateUser);

// Tenant management
router.get('/tenants', adminController.getAllTenants);
router.get('/tenants/:id', adminController.getTenant);
router.patch('/tenants/:id', adminController.updateTenant);
router.delete('/tenants/:id', adminController.deleteTenant);
router.post('/tenants/:id/status', adminController.updateTenantStatus);

// Subscription management
router.get('/subscriptions', adminController.getAllSubscriptions);
router.patch('/subscriptions/:id', adminController.updateSubscription);
router.post('/subscriptions/:id/override', adminController.overrideSubscription);

// Billing and invoices
router.get('/invoices', adminController.getAllInvoices);
router.get('/invoices/:id', adminController.getInvoice);
router.post('/invoices/:id/refund', adminController.refundInvoice);

// System settings
router.get('/settings', adminController.getSystemSettings);
router.patch('/settings', adminController.updateSystemSettings);

// Super-admin only routes
router.use(restrictTo('super-admin'));
router.get('/logs', adminController.getSystemLogs);
router.post('/maintenance-mode', adminController.toggleMaintenanceMode);
router.post('/cache/clear', adminController.clearCache);

module.exports = router;
