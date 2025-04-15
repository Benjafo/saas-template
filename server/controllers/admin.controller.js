const User = require('../models/user.model');
const Tenant = require('../models/tenant.model');
const jwt = require('jsonwebtoken');

/**
 * Get dashboard statistics
 * @route GET /api/v1/admin/stats
 * @protected @admin
 */
exports.getDashboardStats = async (req, res, next) => {
  console.log('Getting dashboard stats..')
  try {
    // In a real application, this would calculate actual statistics
    // For this template, we'll just return mock data

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'subscription.status': 'active' });
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ 'subscription.status': 'active' });

    // Mock revenue data
    const revenue = {
      total: 12500,
      monthly: 2500,
      growth: 15, // percentage
      recurring: 2200
    };

    res.status(200).json({
      status: 'success',
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          growth: 8 // percentage
        },
        tenants: {
          total: totalTenants,
          active: activeTenants,
          growth: 5 // percentage
        },
        revenue,
        conversions: {
          signups: 120,
          trialConversions: 35,
          conversionRate: 29 // percentage
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get revenue statistics
 * @route GET /api/v1/admin/revenue
 * @protected @admin
 */
exports.getRevenueStats = async (req, res, next) => {
  try {
    // In a real application, this would calculate actual revenue statistics
    // For this template, we'll just return mock data

    // Mock monthly revenue data for the past 12 months
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      
      return {
        month: month.toLocaleString('default', { month: 'short' }),
        year: month.getFullYear(),
        revenue: Math.floor(1500 + Math.random() * 1000),
        subscriptions: Math.floor(80 + Math.random() * 20),
        churn: Math.floor(Math.random() * 5)
      };
    }).reverse();

    // Mock revenue by plan
    const revenueByPlan = {
      free: 0,
      starter: 1200,
      professional: 2500,
      enterprise: 8800
    };

    res.status(200).json({
      status: 'success',
      data: {
        monthly: monthlyRevenue,
        byPlan: revenueByPlan,
        mrr: 4500, // Monthly Recurring Revenue
        arr: 54000, // Annual Recurring Revenue
        ltv: 1250, // Lifetime Value
        cac: 350, // Customer Acquisition Cost
        churnRate: 3.5 // percentage
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user growth statistics
 * @route GET /api/v1/admin/users/growth
 * @protected @admin
 */
exports.getUserGrowthStats = async (req, res, next) => {
  try {
    // In a real application, this would calculate actual user growth statistics
    // For this template, we'll just return mock data

    // Mock monthly user growth data for the past 12 months
    const monthlyGrowth = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      
      return {
        month: month.toLocaleString('default', { month: 'short' }),
        year: month.getFullYear(),
        newUsers: Math.floor(10 + Math.random() * 20),
        churnedUsers: Math.floor(Math.random() * 5),
        totalUsers: Math.floor(50 + i * 15 + Math.random() * 10)
      };
    }).reverse();

    res.status(200).json({
      status: 'success',
      data: {
        monthly: monthlyGrowth,
        acquisitionChannels: {
          organic: 45, // percentage
          referral: 25, // percentage
          social: 15, // percentage
          paid: 10, // percentage
          other: 5 // percentage
        },
        retentionRate: 85, // percentage
        churnRate: 15 // percentage
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get subscription distribution
 * @route GET /api/v1/admin/subscriptions/distribution
 * @protected @admin
 */
exports.getSubscriptionDistribution = async (req, res, next) => {
  try {
    // In a real application, this would calculate actual subscription distribution
    // For this template, we'll just return mock data

    // Count users by subscription plan
    const freePlan = await User.countDocuments({ 'subscription.plan': 'free' });
    const starterPlan = await User.countDocuments({ 'subscription.plan': 'starter' });
    const professionalPlan = await User.countDocuments({ 'subscription.plan': 'professional' });
    const enterprisePlan = await User.countDocuments({ 'subscription.plan': 'enterprise' });

    // Count users by subscription status
    const activeStatus = await User.countDocuments({ 'subscription.status': 'active' });
    const trialingStatus = await User.countDocuments({ 'subscription.status': 'trialing' });
    const pastDueStatus = await User.countDocuments({ 'subscription.status': 'past_due' });
    const canceledStatus = await User.countDocuments({ 'subscription.status': 'canceled' });

    res.status(200).json({
      status: 'success',
      data: {
        byPlan: {
          free: freePlan,
          starter: starterPlan,
          professional: professionalPlan,
          enterprise: enterprisePlan
        },
        byStatus: {
          active: activeStatus,
          trialing: trialingStatus,
          pastDue: pastDueStatus,
          canceled: canceledStatus
        },
        conversionRate: {
          trialToActive: 65, // percentage
          freeToStarter: 12, // percentage
          starterToProfessional: 25, // percentage
          professionalToEnterprise: 10 // percentage
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new user
 * @route POST /api/v1/admin/users
 * @protected @admin
 */
exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users
 * @route GET /api/v1/admin/users
 * @protected @admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific user
 * @route GET /api/v1/admin/users/:id
 * @protected @admin
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a user
 * @route PATCH /api/v1/admin/users/:id
 * @protected @admin
 */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user
 * @route DELETE /api/v1/admin/users/:id
 * @protected @admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Impersonate a user
 * @route POST /api/v1/admin/users/:id/impersonate
 * @protected @admin
 */
exports.impersonateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    // Create a special impersonation token
    const token = jwt.sign(
      { 
        id: user._id,
        impersonatedBy: req.user.id,
        isImpersonation: true
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h' // Short expiration for security
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new tenant
 * @route POST /api/v1/admin/tenants
 * @protected @admin
 */
exports.createTenant = async (req, res, next) => {
  try {
    const newTenant = await Tenant.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tenant: newTenant
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all tenants
 * @route GET /api/v1/admin/tenants
 * @protected @admin
 */
exports.getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.find().populate('owner', 'name email');

    res.status(200).json({
      status: 'success',
      results: tenants.length,
      data: {
        tenants
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific tenant
 * @route GET /api/v1/admin/tenants/:id
 * @protected @admin
 */
exports.getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('owner', 'name email');

    if (!tenant) {
      return res.status(404).json({
        status: 'error',
        message: 'No tenant found with that ID'
      });
    }

    // Get users belonging to this tenant
    const users = await User.find({ tenantId: tenant._id }).select('name email role');

    res.status(200).json({
      status: 'success',
      data: {
        tenant,
        users
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a tenant
 * @route PATCH /api/v1/admin/tenants/:id
 * @protected @admin
 */
exports.updateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tenant) {
      return res.status(404).json({
        status: 'error',
        message: 'No tenant found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tenant
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a tenant
 * @route DELETE /api/v1/admin/tenants/:id
 * @protected @admin
 */
exports.deleteTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        status: 'error',
        message: 'No tenant found with that ID'
      });
    }

    // In a real application, you might want to handle associated users
    // For this template, we'll just return success

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update tenant status
 * @route POST /api/v1/admin/tenants/:id/status
 * @protected @admin
 */
exports.updateTenantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a status'
      });
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { active: status === 'active' },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({
        status: 'error',
        message: 'No tenant found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tenant
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new subscription
 * @route POST /api/v1/admin/subscriptions
 * @protected @admin
 */
exports.createSubscription = async (req, res, next) => {
  try {
    const { userId, plan, status, startDate, endDate, seats } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }
    
    // Update the user's subscription
    user.subscription = {
      plan,
      status,
      startDate,
      endDate,
      seats
    };
    
    await user.save({ validateBeforeSave: false });
    
    res.status(201).json({
      status: 'success',
      data: {
        subscription: user.subscription
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all subscriptions
 * @route GET /api/v1/admin/subscriptions
 * @protected @admin
 */
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const users = await User.find().select('name email subscription');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        subscriptions: users.map(user => ({
          userId: user._id,
          name: user.name,
          email: user.email,
          subscription: user.subscription
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific subscription
 * @route GET /api/v1/admin/subscriptions/:id
 * @protected @admin
 */
exports.getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update subscription
 * @route PATCH /api/v1/admin/subscriptions/:id
 * @protected @admin
 */
exports.updateSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    // Update subscription fields
    if (req.body.plan) user.subscription.plan = req.body.plan;
    if (req.body.status) user.subscription.status = req.body.status;
    if (req.body.startDate) user.subscription.startDate = req.body.startDate;
    if (req.body.endDate) user.subscription.endDate = req.body.endDate;
    if (req.body.trialEndsAt) user.subscription.trialEndsAt = req.body.trialEndsAt;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Override subscription
 * @route POST /api/v1/admin/subscriptions/:id/override
 * @protected @admin
 */
exports.overrideSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that ID'
      });
    }

    // Override subscription with custom settings
    user.subscription = {
      ...user.subscription.toObject(),
      ...req.body,
      // Add a flag to indicate this is a custom subscription
      isCustom: true
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all invoices
 * @route GET /api/v1/admin/invoices
 * @protected @admin
 */
exports.getAllInvoices = async (req, res, next) => {
  try {
    // In a real application, this would fetch invoices from Stripe or another payment processor
    // For this template, we'll just return placeholder data

    res.status(200).json({
      status: 'success',
      data: {
        invoices: Array.from({ length: 10 }, (_, i) => ({
          id: `inv_${100000 + i}`,
          userId: `user_${200000 + i}`,
          userName: `User ${i + 1}`,
          userEmail: `user${i + 1}@example.com`,
          amount: Math.floor(1000 + Math.random() * 9000) / 100,
          currency: 'usd',
          status: ['paid', 'paid', 'paid', 'unpaid', 'refunded'][Math.floor(Math.random() * 5)],
          date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
          description: `Subscription - ${['Starter', 'Professional', 'Enterprise'][Math.floor(Math.random() * 3)]} Plan`
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific invoice
 * @route GET /api/v1/admin/invoices/:id
 * @protected @admin
 */
exports.getInvoice = async (req, res, next) => {
  try {
    // In a real application, this would fetch a specific invoice from Stripe or another payment processor
    // For this template, we'll just return placeholder data

    res.status(200).json({
      status: 'success',
      data: {
        invoice: {
          id: req.params.id,
          userId: 'user_123456',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          amount: 49.99,
          currency: 'usd',
          status: 'paid',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          description: 'Subscription - Professional Plan',
          items: [
            {
              description: 'Professional Plan - Monthly',
              amount: 49.99,
              quantity: 1
            }
          ],
          subtotal: 49.99,
          tax: 0,
          total: 49.99,
          paymentMethod: {
            type: 'card',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
            brand: 'Visa'
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Refund an invoice
 * @route POST /api/v1/admin/invoices/:id/refund
 * @protected @admin
 */
exports.refundInvoice = async (req, res, next) => {
  try {
    // In a real application, this would process a refund through Stripe or another payment processor
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      data: {
        message: `Invoice ${req.params.id} has been refunded successfully`,
        refundId: `re_${Math.floor(Math.random() * 1000000)}`
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get system settings
 * @route GET /api/v1/admin/settings
 * @protected @admin
 */
exports.getSystemSettings = async (req, res, next) => {
  try {
    // In a real application, this would fetch settings from a database
    // For this template, we'll just return placeholder data

    res.status(200).json({
      status: 'success',
      data: {
        settings: {
          general: {
            siteName: 'SaaS Platform',
            siteDescription: 'A complete SaaS platform template',
            supportEmail: 'support@example.com',
            maintenanceMode: false
          },
          security: {
            mfaRequired: false,
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireNumbers: true,
              requireSymbols: false,
              passwordExpiryDays: 0
            },
            sessionTimeout: 30 // minutes
          },
          email: {
            provider: 'sendgrid',
            fromEmail: 'noreply@example.com',
            fromName: 'SaaS Platform',
            templates: {
              welcome: 'template_123',
              passwordReset: 'template_124',
              invoiceReceived: 'template_125'
            }
          },
          subscription: {
            trialDays: 14,
            gracePeriodDays: 3
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update system settings
 * @route PATCH /api/v1/admin/settings
 * @protected @admin
 */
exports.updateSystemSettings = async (req, res, next) => {
  try {
    // In a real application, this would update settings in a database
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      data: {
        message: 'System settings updated successfully',
        settings: req.body
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get system logs
 * @route GET /api/v1/admin/logs
 * @protected @super-admin
 */
exports.getSystemLogs = async (req, res, next) => {
  try {
    // In a real application, this would fetch logs from a database or log files
    // For this template, we'll just return placeholder data

    res.status(200).json({
      status: 'success',
      data: {
        logs: Array.from({ length: 20 }, (_, i) => ({
          id: `log_${100000 + i}`,
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
          level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
          message: `System log message ${i + 1}`,
          source: ['system', 'user', 'payment', 'auth'][Math.floor(Math.random() * 4)],
          details: {
            userId: Math.random() > 0.5 ? `user_${200000 + i}` : null,
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle maintenance mode
 * @route POST /api/v1/admin/maintenance-mode
 * @protected @super-admin
 */
exports.toggleMaintenanceMode = async (req, res, next) => {
  try {
    const { enabled, message } = req.body;

    // In a real application, this would update a setting in a database
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      data: {
        maintenanceMode: {
          enabled,
          message: message || 'The system is currently undergoing scheduled maintenance. Please check back later.',
          updatedAt: new Date()
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear cache
 * @route POST /api/v1/admin/cache/clear
 * @protected @super-admin
 */
exports.clearCache = async (req, res, next) => {
  try {
    // In a real application, this would clear application caches
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Cache cleared successfully',
        clearedAt: new Date()
      }
    });
  } catch (err) {
    next(err);
  }
};
