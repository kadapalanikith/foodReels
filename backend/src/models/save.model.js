'use strict';

const mongoose = require('mongoose');

// FIX: was using wrong variable name `mpngoose` (typo) — crashes on Linux
const saveSchema = new mongoose.Schema(
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

// Compound unique index — prevents duplicate saves at DB level & speeds up lookups
saveSchema.index({ user: 1, food: 1 }, { unique: true });

const saveModel = mongoose.model('save', saveSchema);

module.exports = saveModel;
