/**
 * User Controller Module
 *
 * This module handles user-related operations including fetching users,
 * adding new users, and removing existing users from the system.
 * It interacts with the User model and handles file operations for user avatars.
 *
 * @module controllers/usersController
 * @requires bcrypt - For password hashing
 * @requires fs - For file system operations
 * @requires path - For handling file paths
 * @requires models/People - User model for database operations
 */

// External Dependencies
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// Internal Dependencies
const User = require("../models/People");

/**
 * Retrieves all users and renders the users page
 *
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Renders the users page with user data
 */
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new user with encrypted password and optional avatar
 *
 * @async
 * @param {Object} req - Express request object containing user data and files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response indicating success or failure
 */
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create user object with or without avatar
  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // Attempt to save the new user
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

/**
 * Removes a user and their avatar file if it exists
 *
 * @async
 * @param {Object} req - Express request object containing user ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response indicating success or failure
 */
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // Remove associated avatar file if it exists
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

// Export controller functions
module.exports = {
  getUsers,
  addUser,
  removeUser,
};
