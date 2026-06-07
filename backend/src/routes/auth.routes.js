'use strict';

const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  registerUserRules,
  loginUserRules,
  registerPartnerRules,
  loginPartnerRules,
  validate,
} = require('../middlewares/validate.middleware');
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middlewares');

const router = express.Router();

/* ─── User auth ─── */
router.post('/user/register', registerUserRules, validate, authController.registerUser);
router.post('/user/login',    loginUserRules,    validate, authController.loginUser);
router.post('/user/logout',   authController.logoutUser);   // FIX: was GET — logout should be POST

/* ─── Food partner auth ─── */
router.post('/food-partner/register', registerPartnerRules, validate, authController.registerFoodPartner);
router.post('/food-partner/login',    loginPartnerRules,    validate, authController.loginFoodPartner);
router.post('/food-partner/logout',   authController.logoutFoodPartner);

/* ─── Shared: get current user/partner ─── */
router.get('/me', (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });
  next();
}, authController.getMe);

module.exports = router;