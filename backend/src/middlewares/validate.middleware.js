'use strict';

const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * Runs validation result check — must be placed after validation chains.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed', 422, errors.array());
  }
  next();
};

/* ─── User Auth Validators ─── */

const registerUserRules = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must be at most 50 characters'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must be at most 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

const loginUserRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

/* ─── Food Partner Auth Validators ─── */

const registerPartnerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Business name is required')
    .isLength({ max: 100 }).withMessage('Business name must be at most 100 characters'),

  body('contactName')
    .trim()
    .notEmpty().withMessage('Contact name is required')
    .isLength({ max: 100 }).withMessage('Contact name must be at most 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Invalid phone number format'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 300 }).withMessage('Address must be at most 300 characters'),
];

const loginPartnerRules = [...loginUserRules];

/* ─── Food Validators ─── */

const createFoodRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Dish name is required')
    .isLength({ max: 60 }).withMessage('Dish name must be at most 60 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 300 }).withMessage('Description must be at most 300 characters'),
];

const foodActionRules = [
  body('foodId')
    .notEmpty().withMessage('foodId is required')
    .isMongoId().withMessage('Invalid food ID'),
];

module.exports = {
  validate,
  registerUserRules,
  loginUserRules,
  registerPartnerRules,
  loginPartnerRules,
  createFoodRules,
  foodActionRules,
};
