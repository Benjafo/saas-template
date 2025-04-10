const Config = require('../models/config.model');

/**
 * Get subscription plans
 * @route GET /api/v1/config/subscription-plans
 * @public
 */
exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    const config = await Config.findOne({ type: 'subscription_plans' });
    
    if (!config) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    // Return only active plans
    const activePlans = config.plans.filter(plan => plan.active);
    
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
 * Get feature flags
 * @route GET /api/v1/config/feature-flags
 * @protected
 */
exports.getFeatureFlags = async (req, res, next) => {
  try {
    const config = await Config.findOne({ type: 'feature_flags' });
    
    if (!config) {
      return res.status(200).json({
        status: 'success',
        data: {
          featureFlags: {}
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        featureFlags: config.settings
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get system settings
 * @route GET /api/v1/config/system-settings
 * @protected @admin
 */
exports.getSystemSettings = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access system settings'
      });
    }
    
    const config = await Config.findOne({ type: 'system_settings' });
    
    if (!config) {
      return res.status(200).json({
        status: 'success',
        data: {
          systemSettings: {}
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        systemSettings: config.settings
      }
    });
  } catch (err) {
    next(err);
  }
}; 

/**
 * Get marketing content
 * @route GET /api/v1/config/marketing-content
 * @public
 */
exports.getMarketingContent = async (req, res, next) => {
  try {
    const config = await Config.findOne({ type: 'marketing_content' });
    
    if (!config) {
      return res.status(200).json({
        status: 'success',
        data: {
          marketingContent: {}
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        marketingContent: config.settings
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get homepage content
 * @route GET /api/v1/config/homepage-content
 * @public
 */
exports.getHomepageContent = async (req, res, next) => {
  try {
    const config = await Config.findOne({ type: 'homepage_content' });
    
    if (!config) {
      return res.status(200).json({
        status: 'success',
        data: {
          homepageContent: {}
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        homepageContent: config.settings
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get dashboard content
 * @route GET /api/v1/config/dashboard-content
 * @public
 */
exports.getDashboardContent = async (req, res, next) => {
  try {
    const config = await Config.findOne({ type: 'dashboard_content' });
    
    if (!config) {
      return res.status(200).json({
        status: 'success',
        data: {
          dashboardContent: {}
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        dashboardContent: config.settings
      }
    });
  } catch (err) {
    next(err);
  }
};
