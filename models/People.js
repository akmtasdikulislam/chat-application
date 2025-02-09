/**
 * @fileoverview People Model Schema Definition
 * @description This file defines the Mongoose schema for the People collection in MongoDB.
 *              It represents user data with various attributes and role-based access control.
 * @module models/People
 * @requires mongoose
 * @author Akm Tasdikul Islam
 * @version 1.0.0
 * @license MIT
 */

// External dependencies
const mongoose = require("mongoose");

/**
 * @typedef {Object} PeopleSchema
 * @property {string} name - The person's full name (required, trimmed)
 * @property {string} email - Unique email address for identification (required, trimmed, lowercase)
 * @property {string} mobile - Contact number for communication (required)
 * @property {string} password - Hashed password for authentication (required)
 * @property {string} [avatar] - URL to user's profile picture (optional)
 * @property {('admin'|'user')} [role=user] - Access control role
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 */

/**
 * Mongoose schema definition for People collection
 * Implements user data structure with validation and formatting rules
 */
const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the People model
const People = mongoose.model("People", peopleSchema);

module.exports = People;