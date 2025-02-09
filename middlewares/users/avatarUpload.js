/**
 * @fileoverview Avatar Upload Middleware
 * @description Handles user avatar image upload functionality with file type and size validation
 * @module middlewares/users/avatarUpload
 * @requires utilities/singleUploader
 *
 * @summary This middleware validates and processes avatar image uploads for users
 * @author Akm Tasdikul Islam
 * @version 1.0.0
 */

// Import dependencies
const uploader = require("../../utilities/singleUploader");

/**
 * Middleware function to handle avatar image uploads
 * @function avatarUpload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function avatarUpload(req, res, next) {
  // Initialize uploader with configuration
  const upload = uploader(
    "avatars", // Upload directory
    ["image/jpeg", "image/jpg", "image/png"], // Allowed file types
    1000000, // Max file size (1MB)
    "Only .jpg, .jpeg or .png format allowed!" // Error message
  );

  // Execute the upload middleware
  upload.any()(req, res, (err) => {
    if (err) {
      // Handle upload errors
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      // Proceed to next middleware if upload successful
      next();
    }
  });
}

// Export middleware
module.exports = avatarUpload;
