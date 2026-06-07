'use strict';

// FIX: was requiring 'foodPartner.model' (wrong casing/name) — crashes on Linux
const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware for food partner authentication.
 * Verifies JWT, checks role claim, and attaches the full partner document.
 */
async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return sendError(res, 'Authentication required.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: role-based check — prevents users from accessing partner routes
    if (decoded.role !== 'food-partner') {
      return sendError(res, 'Access denied. Food partner account required.', 403);
    }

    const foodPartner = await foodPartnerModel.findById(decoded.id).select('-password');

    if (!foodPartner || !foodPartner.isActive) {
      return sendError(res, 'Food partner account not found or deactivated.', 401);
    }

    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token.', 401);
  }
}

/**
 * Middleware for regular user authentication.
 * Verifies JWT, checks role claim, and attaches the user to req.
 */
async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return sendError(res, 'Authentication required.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: role-based check — prevents food partners from accessing user routes
    if (decoded.role !== 'user') {
      return sendError(res, 'Access denied. User account required.', 403);
    }

    // FIX: fetch the full user document for consistency
    // Note: req.user now has ._id (from DB) and decoded.id is used where needed
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return sendError(res, 'User account not found or deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token.', 401);
  }
}

/**
 * Optional auth middleware — doesn't block unauthenticated requests,
 * but attaches user if token is present. Used for the public feed.
 */
async function optionalAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'user') {
      req.user = { id: decoded.id, role: decoded.role };
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware, optionalAuthMiddleware };
