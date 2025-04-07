const User = require('../models/user.model');
const Tenant = require('../models/tenant.model');
const Config = require('../models/config.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get available subscription plans
 * @route GET /api/v1/subscriptions/plans
 * @protected
 */
exports.getAvailablePlans = async (req, res, next) => {
  try {
    // Get plans from the database
    const plansConfig = await Config.findOne({ type: 'subscription_plans' });
    
    if (!plansConfig) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    // Return plans that are active
    const activePlans = plansConfig.plans.filter(plan => plan.active);
    
    res.status(200).json({
      status: 'success',
      data: {
        plans: activePlans
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current subscription
 * @route GET /api/v1/subscriptions/current
 * @protected
 */
exports.getCurrentSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get plans from the database
    const plansConfig = await Config.findOne({ type: 'subscription_plans' });
    
    if (!plansConfig) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    // Find the plan that matches the user's subscription
    const planDetails = plansConfig.plans.find(plan => plan.id === user.subscription.plan);
    
    res.status(200).json({
      status: 'success',
      data: {
        subscription: {
          ...user.subscription.toObject(),
          planDetails
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create Stripe checkout session
 * @route POST /api/v1/subscriptions/create-checkout-session
 * @protected
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    // Get plans from the database
    const plansConfig = await Config.findOne({ type: 'subscription_plans' });
    
    if (!plansConfig) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    // Check if the selected plan exists and is active
    const selectedPlan = plansConfig.plans.find(p => p.id === plan && p.active);
    
    if (!selectedPlan) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid plan'
      });
    }

    // In a real application, this would create a Stripe checkout session
    // For this template, we'll just return a mock session URL

    res.status(200).json({
      status: 'success',
      data: {
        sessionUrl: `https://example.com/checkout/session/${plan}/${req.user.id}`
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create Stripe customer portal session
 * @route POST /api/v1/subscriptions/create-portal-session
 * @protected
 */
exports.createPortalSession = async (req, res, next) => {
  try {
    // In a real application, this would create a Stripe customer portal session
    // For this template, we'll just return a mock session URL

    res.status(200).json({
      status: 'success',
      data: {
        sessionUrl: `https://example.com/customer-portal/${req.user.id}`
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Upgrade subscription
 * @route POST /api/v1/subscriptions/upgrade
 * @protected
 */
exports.upgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    // Get plans from the database
    const plansConfig = await Config.findOne({ type: 'subscription_plans' });
    
    if (!plansConfig) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    // Check if the selected plan exists and is active
    const selectedPlan = plansConfig.plans.find(p => p.id === plan && p.active);
    
    if (!selectedPlan) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid plan'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if the plan is an actual upgrade
    const planHierarchy = ['free', 'pro', 'enterprise'];
    const currentPlanIndex = planHierarchy.indexOf(user.subscription.plan);
    const newPlanIndex = planHierarchy.indexOf(plan);
    
    if (newPlanIndex <= currentPlanIndex) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot upgrade from ${user.subscription.plan} to ${plan}. Please choose a higher tier plan.`
      });
    }
    
    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription
    
    // Update subscription
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.startDate = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // If user has a tenant, update tenant subscription as well
    if (user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      if (tenant && tenant.owner.equals(user._id)) {
        tenant.subscription.plan = plan;
        tenant.subscription.status = 'active';
        tenant.subscription.startDate = Date.now();
        
        // Get features from the selected plan
        const features = selectedPlan.features.reduce((obj, feature) => {
          obj[feature.name] = feature.enabled;
          if (feature.limit !== null) {
            obj[`${feature.name}Limit`] = feature.limit;
          }
          return obj;
        }, {});
        
        // Update features based on plan limits
        tenant.subscription.features = {
          storage: selectedPlan.limits.storage || 100,
          customDomain: features.customDomain || false,
          apiAccess: features.apiAccess || false,
          whiteLabeling: features.whiteLabeling || false,
          prioritySupport: features.prioritySupport || false
        };
        
        await tenant.save();
      }
    }
    
    // Get the full plan details to return
    const planDetails = plansConfig.plans.find(p => p.id === plan);
    
    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription,
        planDetails
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Downgrade subscription
 * @route POST /api/v1/subscriptions/downgrade
 * @protected
 */
exports.downgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid plan'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if the plan is an actual downgrade
    const planHierarchy = ['free', 'starter', 'professional', 'enterprise'];
    const currentPlanIndex = planHierarchy.indexOf(user.subscription.plan);
    const newPlanIndex = planHierarchy.indexOf(plan);

    if (newPlanIndex >= currentPlanIndex) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot downgrade from ${user.subscription.plan} to ${plan}. Please choose a lower tier plan.`
      });
    }

    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription

    // Update subscription - will take effect at the end of the current billing period
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.endDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now
    await user.save({ validateBeforeSave: false });

    // If user has a tenant, update tenant subscription as well
    if (user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      if (tenant && tenant.owner.equals(user._id)) {
        tenant.subscription.plan = plan;
        tenant.subscription.status = 'active';
        tenant.subscription.endDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
        
        // Update features based on plan
        tenant.subscription.features = {
          storage: SUBSCRIPTION_PLANS[plan].features.storage,
          customDomain: SUBSCRIPTION_PLANS[plan].features.customDomain,
          apiAccess: SUBSCRIPTION_PLANS[plan].features.apiAccess,
          whiteLabeling: SUBSCRIPTION_PLANS[plan].features.whiteLabeling,
          prioritySupport: SUBSCRIPTION_PLANS[plan].features.prioritySupport
        };
        
        await tenant.save();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription,
        planDetails: SUBSCRIPTION_PLANS[plan],
        message: 'Your subscription will be downgraded at the end of the current billing period.'
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel subscription
 * @route POST /api/v1/subscriptions/cancel
 * @protected
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription

    // Update subscription
    user.subscription.status = 'canceled';
    user.subscription.endDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now
    await user.save({ validateBeforeSave: false });

    // If user has a tenant, update tenant subscription as well
    if (user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      if (tenant && tenant.owner.equals(user._id)) {
        tenant.subscription.status = 'canceled';
        tenant.subscription.endDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await tenant.save();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription,
        message: 'Your subscription has been canceled and will end on ' + 
                 new Date(user.subscription.endDate).toLocaleDateString()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reactivate subscription
 * @route POST /api/v1/subscriptions/reactivate
 * @protected
 */
exports.reactivateSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.subscription.status !== 'canceled') {
      return res.status(400).json({
        status: 'error',
        message: 'Only canceled subscriptions can be reactivated'
      });
    }

    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription

    // Update subscription
    user.subscription.status = 'active';
    user.subscription.endDate = undefined;
    await user.save({ validateBeforeSave: false });

    // If user has a tenant, update tenant subscription as well
    if (user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      if (tenant && tenant.owner.equals(user._id)) {
        tenant.subscription.status = 'active';
        tenant.subscription.endDate = undefined;
        await tenant.save();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription,
        message: 'Your subscription has been reactivated'
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get subscription usage
 * @route GET /api/v1/subscriptions/usage
 * @protected
 */
exports.getUsage = async (req, res, next) => {
  try {
    // In a real application, this would calculate actual usage
    // For this template, we'll just return mock data

    res.status(200).json({
      status: 'success',
      data: {
        usage: {
          storage: {
            used: 256, // MB
            total: SUBSCRIPTION_PLANS[req.user.subscription.plan].features.storage,
            percentage: 256 / SUBSCRIPTION_PLANS[req.user.subscription.plan].features.storage * 100
          },
          users: {
            used: 2,
            total: SUBSCRIPTION_PLANS[req.user.subscription.plan].features.users,
            percentage: typeof SUBSCRIPTION_PLANS[req.user.subscription.plan].features.users === 'number' 
              ? 2 / SUBSCRIPTION_PLANS[req.user.subscription.plan].features.users * 100
              : 0 // If unlimited
          },
          apiCalls: {
            used: 1250,
            total: 5000,
            percentage: 25
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get subscription limits
 * @route GET /api/v1/subscriptions/limits
 * @protected
 */
exports.getLimits = async (req, res, next) => {
  try {
    const planFeatures = SUBSCRIPTION_PLANS[req.user.subscription.plan].features;

    res.status(200).json({
      status: 'success',
      data: {
        limits: {
          storage: planFeatures.storage,
          users: planFeatures.users,
          customDomain: planFeatures.customDomain,
          apiAccess: planFeatures.apiAccess,
          whiteLabeling: planFeatures.whiteLabeling,
          prioritySupport: planFeatures.prioritySupport
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle Stripe webhook
 * @route POST /api/v1/subscriptions/webhook
 * @public
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    // In a real application, this would verify and process Stripe webhook events
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      message: 'Webhook received'
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN ONLY CONTROLLERS

/**
 * Get all subscriptions
 * @route GET /api/v1/subscriptions
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
          subscription: user.subscription,
          planDetails: SUBSCRIPTION_PLANS[user.subscription.plan]
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update subscription (admin only)
 * @route PATCH /api/v1/subscriptions/:id
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

    // If user has a tenant, update tenant subscription as well
    if (user.tenantId) {
      const tenant = await Tenant.findById(user.tenantId);
      if (tenant && tenant.owner.equals(user._id)) {
        if (req.body.plan) {
          tenant.subscription.plan = req.body.plan;
          // Update features based on plan
          tenant.subscription.features = {
            storage: SUBSCRIPTION_PLANS[req.body.plan].features.storage,
            customDomain: SUBSCRIPTION_PLANS[req.body.plan].features.customDomain,
            apiAccess: SUBSCRIPTION_PLANS[req.body.plan].features.apiAccess,
            whiteLabeling: SUBSCRIPTION_PLANS[req.body.plan].features.whiteLabeling,
            prioritySupport: SUBSCRIPTION_PLANS[req.body.plan].features.prioritySupport
          };
        }
        if (req.body.status) tenant.subscription.status = req.body.status;
        if (req.body.startDate) tenant.subscription.startDate = req.body.startDate;
        if (req.body.endDate) tenant.subscription.endDate = req.body.endDate;
        if (req.body.trialEndsAt) tenant.subscription.trialEndsAt = req.body.trialEndsAt;
        
        await tenant.save();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription: user.subscription,
        planDetails: SUBSCRIPTION_PLANS[user.subscription.plan]
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Override subscription (admin only)
 * @route POST /api/v1/subscriptions/:id/override
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
