const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get user profile
 * @route GET /api/v1/users/profile
 * @protected
 */
exports.getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by the auth middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user profile
 * @route PATCH /api/v1/users/profile
 * @protected
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'This route is not for password updates. Please use /auth/update-password'
      });
    }

    // 2) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user preferences
 * @route PATCH /api/v1/users/preferences
 * @protected
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    // Filter to only allow updating preferences
    const filteredBody = { preferences: req.body.preferences };

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user subscription
 * @route GET /api/v1/users/subscription
 * @protected
 */
exports.getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

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
 * Upgrade subscription
 * @route POST /api/v1/users/subscription/upgrade
 * @protected
 */
exports.upgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a plan to upgrade to'
      });
    }

    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription

    const user = await User.findById(req.user.id);

    // Check if the plan is an actual upgrade
    const planHierarchy = ['free', 'starter', 'professional', 'enterprise'];
    const currentPlanIndex = planHierarchy.indexOf(user.subscription.plan);
    const newPlanIndex = planHierarchy.indexOf(plan);

    if (newPlanIndex <= currentPlanIndex) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot upgrade from ${user.subscription.plan} to ${plan}. Please choose a higher tier plan.`
      });
    }

    // Update subscription
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.startDate = Date.now();
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
 * Downgrade subscription
 * @route POST /api/v1/users/subscription/downgrade
 * @protected
 */
exports.downgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a plan to downgrade to'
      });
    }

    // In a real application, this would interact with Stripe or another payment processor
    // For this template, we'll just update the user's subscription

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

    // Update subscription
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.startDate = Date.now();
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
 * Cancel subscription
 * @route POST /api/v1/users/subscription/cancel
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
 * Get billing information
 * @route GET /api/v1/users/billing
 * @protected
 */
exports.getBillingInfo = async (req, res, next) => {
  try {
    // In a real application, this would fetch data from Stripe or another payment processor
    // For this template, we'll just return a placeholder

    res.status(200).json({
      status: 'success',
      data: {
        billing: {
          name: req.user.name,
          email: req.user.email,
          paymentMethod: 'card',
          lastFour: '4242',
          expiryMonth: 12,
          expiryYear: 2025
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update billing information
 * @route PATCH /api/v1/users/billing
 * @protected
 */
exports.updateBillingInfo = async (req, res, next) => {
  try {
    // In a real application, this would update data in Stripe or another payment processor
    // For this template, we'll just return a success message

    res.status(200).json({
      status: 'success',
      message: 'Billing information updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get invoices
 * @route GET /api/v1/users/invoices
 * @protected
 */
exports.getInvoices = async (req, res, next) => {
  try {
    // In a real application, this would fetch invoices from Stripe or another payment processor
    // For this template, we'll just return placeholder data

    res.status(200).json({
      status: 'success',
      data: {
        invoices: [
          {
            id: 'inv_123456',
            amount: 19.99,
            currency: 'usd',
            status: 'paid',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            description: 'Subscription - Starter Plan'
          },
          {
            id: 'inv_123457',
            amount: 19.99,
            currency: 'usd',
            status: 'paid',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            description: 'Subscription - Starter Plan'
          }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN ONLY CONTROLLERS

/**
 * Get all users
 * @route GET /api/v1/users
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
 * Create a new user (admin only)
 * @route POST /api/v1/users
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
 * Get a specific user
 * @route GET /api/v1/users/:id
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
 * @route PATCH /api/v1/users/:id
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
 * @route DELETE /api/v1/users/:id
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
 * Filter object to only allow certain fields
 * @param {Object} obj - Object to filter
 * @param  {...String} allowedFields - Fields to allow
 * @returns {Object} Filtered object
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
