const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Generate JWT token for authentication
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const signToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set!');
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
  } catch (error) {
    console.error('Error signing JWT token:', error);
    throw error;
  }
};

/**
 * Create and send JWT token in response
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 30) * 24 * 60 * 60 * 1000 // Default 30 days
      ),
      httpOnly: true, // Prevent XSS attacks
      // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      secure: false,
      sameSite: 'lax', // Use 'lax' for better compatibility
      path: '/', // Ensure cookie is available on all paths
      domain: undefined // Let the browser set the domain automatically
    };
    
    console.log('Setting cookie with options:', {
      ...cookieOptions,
      expires: cookieOptions.expires.toISOString()
    });

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      // Token is no longer sent in the response body
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error in createSendToken:', error);
    // Instead of crashing, send a 500 response
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during authentication. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    // Generate JWT token and send response
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check database connection status
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Login failed: Database not connected');
      return res.status(503).json({
        status: 'error',
        message: 'Database connection unavailable. Please try again later.',
        details: {
          readyState: mongoose.connection.readyState,
          connectionState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
        }
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    console.log('Login successful for user:', user.email);
    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    // Send a more detailed error response
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

/**
 * Forgot password - send reset token
 * @route POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with that email address',
      });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email (in a real app)
    try {
      // In a real application, you would send an email here
      // For this template, we'll just return the token
      
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
        resetToken, // In a real app, you wouldn't send this in the response
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!',
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password using token
 * @route PATCH /api/v1/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
      });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // This is handled by a pre-save middleware in the User model

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Update current user password
 * @route PATCH /api/v1/auth/update-password
 * @protected
 */
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is wrong',
      });
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 * @route GET /api/v1/auth/me
 * @protected
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

/**
 * Update current user data (except password)
 * @route PATCH /api/v1/auth/update-me
 * @protected
 */
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'This route is not for password updates. Please use /update-password',
      });
    }

    // 2) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete (deactivate) current user
 * @route DELETE /api/v1/auth/delete-me
 * @protected
 */
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
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

/**
 * Logout user by clearing the JWT cookie
 * @route GET /api/v1/auth/logout
 */
exports.logout = (req, res) => {
  // Clear the cookie by setting it to an empty value and expiring it immediately
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
  res.status(200).json({ status: 'success' });
}
