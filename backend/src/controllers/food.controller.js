'use strict';

const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const foodpartnerModel = require('../models/foodpartner.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const PAGE_SIZE = 10;

/**
 * POST /api/v1/food
 * Food partners only — upload a new food reel
 */
const createFood = asyncHandler(async (req, res) => {
  // FIX: was `req.file.buffer` without null check → TypeError if no file uploaded
  if (!req.file || !req.file.buffer) {
    return sendError(res, 'A video file is required.', 400);
  }

  const { name, description } = req.body;
  const fileName = `${uuid()}-${req.file.originalname.replace(/\s+/g, '_')}`;

  // Upload to ImageKit
  const uploadResult = await storageService.uploadFile(
    req.file.buffer,
    fileName,
    req.file.mimetype
  );

  // FIX: was `new foodModel.create(...)` — mixing `new` + `.create()` always throws
  const foodItem = await foodModel.create({
    name,
    description,
    video: uploadResult.url,
    videoFileId: uploadResult.fileId,
    foodPartner: req.foodPartner._id,
  });

  // Increment partner's reel count
  await foodpartnerModel.findByIdAndUpdate(req.foodPartner._id, { $inc: { totalReels: 1 } });

  logger.info(`[Food] New reel created: ${foodItem._id} by partner ${req.foodPartner._id}`);

  return sendSuccess(res, 'Food reel published successfully.', { food: foodItem }, 201);
});

/**
 * GET /api/v1/food
 * Public/user-facing — paginated feed
 */
const getFoodItems = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(PAGE_SIZE, parseInt(req.query.limit, 10) || PAGE_SIZE);
  const skip = (page - 1) * limit;

  // FIX: was `foodModel.find({})` with no pagination — returns every document
  const [foodItems, total] = await Promise.all([
    foodModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('foodPartner', 'name avatarUrl address'),
    foodModel.countDocuments({ isActive: true }),
  ]);

  // If user is authenticated, attach liked/saved state per reel
  let likedIds = new Set();
  let savedIds = new Set();
  if (req.user) {
    const userId = req.user.id; // FIX: was req.user._id — JWT payload has `id` not `_id`
    const foodIds = foodItems.map((f) => f._id);

    const [likes, saves] = await Promise.all([
      likeModel.find({ user: userId, food: { $in: foodIds } }).select('food'),
      saveModel.find({ user: userId, food: { $in: foodIds } }).select('food'),
    ]);

    likedIds = new Set(likes.map((l) => l.food.toString()));
    savedIds = new Set(saves.map((s) => s.food.toString()));
  }

  const enrichedItems = foodItems.map((item) => ({
    ...item.toObject(),
    isLiked: likedIds.has(item._id.toString()),
    isSaved: savedIds.has(item._id.toString()),
  }));

  return sendSuccess(res, 'Feed fetched successfully.', {
    foodItems: enrichedItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNextPage: page < Math.ceil(total / limit),
    },
  });
});

/**
 * POST /api/v1/food/like
 * Toggle like on a food item
 */
const likeFood = asyncHandler(async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user.id; // FIX: was req.user._id — JWT payload uses `id`

  // Verify food exists
  const food = await foodModel.findById(foodId);
  if (!food) {
    return sendError(res, 'Food item not found.', 404);
  }

  const existingLike = await likeModel.findOne({ user: userId, food: foodId });

  if (existingLike) {
    // Unlike
    await likeModel.deleteOne({ user: userId, food: foodId });
    const updated = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: -1 } },
      { new: true }
    );
    return sendSuccess(res, 'Unliked successfully.', { likeCount: Math.max(0, updated.likeCount), isLiked: false });
  }

  // Like
  await likeModel.create({ user: userId, food: foodId });
  const updated = await foodModel.findByIdAndUpdate(
    foodId,
    { $inc: { likeCount: 1 } },
    { new: true }
  );

  return sendSuccess(res, 'Liked successfully.', { likeCount: updated.likeCount, isLiked: true }, 201);
});

/**
 * POST /api/v1/food/save
 * Toggle save on a food item
 */
const saveFood = asyncHandler(async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user.id; // FIX: was req.user._id

  const food = await foodModel.findById(foodId);
  if (!food) {
    return sendError(res, 'Food item not found.', 404);
  }

  const existingSave = await saveModel.findOne({ user: userId, food: foodId });

  if (existingSave) {
    await saveModel.deleteOne({ user: userId, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
    return sendSuccess(res, 'Removed from saved.', { isSaved: false });
  }

  await saveModel.create({ user: userId, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });

  return sendSuccess(res, 'Saved successfully.', { isSaved: true }, 201);
});

/**
 * POST /api/v1/food/view
 * Increment view count (fire-and-forget style)
 */
const incrementView = asyncHandler(async (req, res) => {
  const { foodId } = req.body;
  // Non-blocking update
  foodModel.findByIdAndUpdate(foodId, { $inc: { viewCount: 1 } }).exec();
  return sendSuccess(res, 'View recorded.');
});

module.exports = { createFood, getFoodItems, likeFood, saveFood, incrementView };
