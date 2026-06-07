'use strict';

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User reference is required'],
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'food',
      required: [true, 'Food reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — prevents duplicate likes at DB level & speeds up lookups
likeSchema.index({ user: 1, food: 1 }, { unique: true });

const Like = mongoose.model('like', likeSchema);

module.exports = Like;