'use strict';

// FIX: was require('../models/food-partner.model') — file doesn't exist (it's foodpartner.model.js)
const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * GET /api/v1/food-partner/:id
 * Returns a food partner's public profile and their reels
 */
const getFoodPartnerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foodPartner = await foodPartnerModel.findById(id).select('-password');

  if (!foodPartner) {
    return sendError(res, 'Food partner not found.', 404);
  }

  // FIX: was querying with `{foodPartnerId: id}` but schema field is `foodPartner`
  const foodItems = await foodModel
    .find({ foodPartner: id, isActive: true })
    .sort({ createdAt: -1 })
    .select('name description video likeCount saveCount viewCount createdAt');

  return sendSuccess(res, 'Food partner profile fetched.', {
    partner: {
      ...foodPartner.toObject(),
      totalReels: foodItems.length,
    },
    reels: foodItems,
  });
});

/**
 * GET /api/v1/food-partner/profile
 * Returns the authenticated food partner's own profile
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const partner = await foodPartnerModel.findById(req.foodPartner._id).select('-password');

  if (!partner) {
    return sendError(res, 'Partner profile not found.', 404);
  }

  const reels = await foodModel
    .find({ foodPartner: partner._id, isActive: true })
    .sort({ createdAt: -1 });

  const totalLikes = reels.reduce((sum, reel) => sum + (reel.likeCount || 0), 0);
  const totalViews = reels.reduce((sum, reel) => sum + (reel.viewCount || 0), 0);

  return sendSuccess(res, 'Profile fetched.', {
    partner: partner.toObject(),
    reels,
    stats: {
      totalReels: reels.length,
      totalLikes,
      totalViews,
    },
  });
});

module.exports = { getFoodPartnerById, getMyProfile };
