'use strict';

const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name must be at most 100 characters'],
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Contact name must be at most 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [300, 'Address must be at most 300 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,                      // Normalise to lowercase
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,                         // Never return password in queries
    },
    role: {
      type: String,
      default: 'food-partner',
      enum: ['food-partner'],
    },
    avatarUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    totalReels: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

foodPartnerSchema.index({ email: 1 });

const foodPartnerModel = mongoose.model('foodpartner', foodPartnerSchema);

module.exports = foodPartnerModel;