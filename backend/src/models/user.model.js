'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name must be at most 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,                      // FIX: normalise to lowercase — prevents case-sensitive duplicates
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,                         // Never return password in queries by default
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user'],
    },
    savedReels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'food' }],
    likedReels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'food' }],
    avatarUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Index for fast email lookups
userSchema.index({ email: 1 });

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
