'use strict';

const express = require('express');
const foodPartnerController = require('../controllers/food-partner.controller');
// FIX: was require('../middlewares/auth.middleware') — file doesn't exist (correct: auth.middlewares.js)
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middlewares');

const router = express.Router();

// Get own profile (authenticated food partner)
router.get('/profile', authFoodPartnerMiddleware, foodPartnerController.getMyProfile);

// Get any partner's public profile (authenticated user)
router.get('/:id', authUserMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;