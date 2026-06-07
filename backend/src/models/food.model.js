'use strict';

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      maxlength: [60, 'Dish name must be at most 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description must be at most 300 characters'],
    },
    video: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    videoFileId: {
      type: String,                          // ImageKit fileId for deletion
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodpartner',
      required: [true, 'Food partner reference is required'],
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    saveCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast partner lookups and sorting by newest
foodSchema.index({ foodPartner: 1, createdAt: -1 });
foodSchema.index({ likeCount: -1 });

const foodModel = mongoose.model('food', foodSchema);

module.exports = foodModel;