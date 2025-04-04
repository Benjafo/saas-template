/**
 * Authentication middleware
 * Verifies JWT tokens and attaches user to request object
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

/**
 * Middleware to protect routes that require authentication
 */
const authenticate = async (req, res, next) => {
  try {
    // 1) Check if token exists in cookies
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === 'loggedout') { // Check for token and the 'loggedout' value set during logout
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password. Please log in again.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to restrict access to certain roles
 * @param  {...String} roles - Roles that are allowed to access the route
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  restrictTo
};
