'use strict';

const express = require('express');
const foodController = require('../controllers/food.controller');
const { authFoodPartnerMiddleware, authUserMiddleware, optionalAuthMiddleware } = require('../middlewares/auth.middlewares');
const { createFoodRules, foodActionRules, validate } = require('../middlewares/validate.middleware');
const multer = require('multer');

const router = express.Router();

// FIX: added file size limit (100MB) and mime type filter to multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only MP4, WebM, and MOV are allowed.`));
    }
  },
});

/* ─── Food routes ─── */

// Upload a food reel (food partners only)
router.post(
  '/',
  authFoodPartnerMiddleware,
  upload.single('video'),        // field name changed from 'image' to 'video' (semantically correct)
  createFoodRules,
  validate,
  foodController.createFood
);

// Get paginated feed (public with optional auth to get liked/saved state)
router.get('/', optionalAuthMiddleware, foodController.getFoodItems);

// FIX: was `foodController.likeFoodController` — function doesn't exist; correct name is `likeFood`
router.post('/like', authUserMiddleware, foodActionRules, validate, foodController.likeFood);

router.post('/save', authUserMiddleware, foodActionRules, validate, foodController.saveFood);

// View count (no auth required — fire-and-forget)
router.post('/view', foodActionRules, validate, foodController.incrementView);

module.exports = router;