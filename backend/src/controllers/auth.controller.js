'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');           // FIX: was 'bcrypt' but package installed is 'bcryptjs'
const jwt = require('jsonwebtoken');
const foodpartnerModel = require('../models/foodpartner.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/* ─── Cookie options ─── */
const COOKIE_OPTIONS = {
  httpOnly: true,                           // FIX: was missing — prevents XSS token theft
  secure: process.env.NODE_ENV === 'production', // FIX: was missing — HTTPS only in prod
  sameSite: 'strict',                       // FIX: was missing — CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in ms
  path: '/',
};

/* ─── JWT helpers ─── */
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',                        // FIX: was missing — tokens were valid forever
  });

/* ══════════════════════════════════════
   USER AUTH
══════════════════════════════════════ */

/**
 * POST /api/v1/auth/user/register
 */
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check duplicate (email is lowercased by model)
  const isUserAlreadyExist = await userModel.findOne({ email: email.toLowerCase() });
  if (isUserAlreadyExist) {
    return sendError(res, 'An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // FIX: JWT now includes role claim — prevents users from impersonating food partners
  const token = signToken({ id: user._id, role: 'user' });

  res.cookie('token', token, COOKIE_OPTIONS);

  logger.info(`[Auth] New user registered: ${user.email}`);

  return sendSuccess(
    res,
    'Account created successfully.',
    {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: 'user',
      },
    },
    201
  );
});

/**
 * POST /api/v1/auth/user/login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // FIX: must include password (+password) since select: false on schema
  const user = await userModel.findOne({ email: email.toLowerCase() }).select('+password');

  // Use vague message to not leak whether email exists
  if (!user) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const token = signToken({ id: user._id, role: 'user' });
  res.cookie('token', token, COOKIE_OPTIONS);

  logger.info(`[Auth] User logged in: ${user.email}`);

  return sendSuccess(res, 'Login successful.', {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
    },
  });
});

/**
 * POST /api/v1/auth/user/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  return sendSuccess(res, 'Logged out successfully.');
});

/* ══════════════════════════════════════
   FOOD PARTNER AUTH
══════════════════════════════════════ */

/**
 * POST /api/v1/auth/food-partner/register
 */
const registerFoodPartner = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, contactName } = req.body;

  const isFoodPartnerAlreadyExist = await foodpartnerModel.findOne({ email: email.toLowerCase() });
  if (isFoodPartnerAlreadyExist) {
    return sendError(res, 'A partner account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const foodPartner = await foodpartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName,
  });

  // FIX: role claim = 'food-partner'
  const token = signToken({ id: foodPartner._id, role: 'food-partner' });

  res.cookie('token', token, COOKIE_OPTIONS);

  logger.info(`[Auth] New food partner registered: ${foodPartner.email}`);

  return sendSuccess(
    res,
    'Partner account created successfully.',
    {
      partner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
        address: foodPartner.address,
        phone: foodPartner.phone,
        contactName: foodPartner.contactName,
        role: 'food-partner',
      },
    },
    201
  );
});

/**
 * POST /api/v1/auth/food-partner/login
 */
const loginFoodPartner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const partner = await foodpartnerModel.findOne({ email: email.toLowerCase() }).select('+password');

  if (!partner) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, partner.password);
  if (!isPasswordValid) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const token = signToken({ id: partner._id, role: 'food-partner' });
  res.cookie('token', token, COOKIE_OPTIONS);

  logger.info(`[Auth] Food partner logged in: ${partner.email}`);

  return sendSuccess(res, 'Login successful.', {
    partner: {
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      role: 'food-partner',
    },
  });
});

/**
 * POST /api/v1/auth/food-partner/logout
 */
const logoutFoodPartner = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  return sendSuccess(res, 'Logged out successfully.');
});

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user/partner based on JWT role
 */
const getMe = asyncHandler(async (req, res) => {
  if (req.user) {
    return sendSuccess(res, 'Authenticated user.', { user: req.user, role: 'user' });
  }
  if (req.foodPartner) {
    return sendSuccess(res, 'Authenticated partner.', { partner: req.foodPartner, role: 'food-partner' });
  }
  return sendError(res, 'Not authenticated.', 401);
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getMe,
};
