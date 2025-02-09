/**
 * User Validation Middleware
 *
 * This module provides validation middleware for user-related operations in the application.
 * It includes validators for user registration fields and handles validation errors.
 * Part of the user management system that ensures data integrity and proper validation
 * before user creation.
 *
 * @module middlewares/users/userValidators
 * @requires express-validator
 * @requires http-errors
 * @requires models/People
 * @requires fs
 * @requires path
 */

// External Dependencies
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

// Internal Dependencies
const User = require("../../models/People");

/**
 * Array of validation middleware for adding new users
 * Validates name, email, mobile number, and password
 * @constant {Array} addUserValidators
 */
const addUserValidators = [
  // Name validation
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is require")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),

  // Email validation with uniqueness check
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already in use");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  // Mobile number validation with Bangladesh format and uniqueness check
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile number already in use");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  // Password strength validation
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

/**
 * Handles validation results and manages error responses
 * If validation fails, removes any uploaded avatar files and returns error messages
 *
 * @function addUserValidationHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // Remove uploaded avatar files if validation fails
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    // Send validation errors response
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidators,
  addUserValidationHandler,
};
