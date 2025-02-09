/**
 * @fileoverview Utility module for handling single file uploads using Multer
 * @module utilities/singleUploader
 * @description This module provides a configurable file upload functionality using Multer middleware.
 * It handles file storage, naming conventions, size limits, and file type validation.
 * @requires multer
 * @requires path
 * @requires http-errors
 */

// External dependencies
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

/**
 * Creates and configures a Multer upload middleware instance
 * @function uploader
 * @param {string} subfolder_path - The subdirectory path where files will be stored
 * @param {string[]} allowed_file_types - Array of allowed MIME types
 * @param {number} max_file_size - Maximum file size in bytes
 * @param {string} error_msg - Custom error message for validation failures
 * @returns {Object} Configured Multer middleware instance
 */
function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) {
  // Define the complete upload path including the subfolder
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;

  // Configure storage settings for Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      // Generate unique filename: original-name-timestamp.extension
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // Create and configure Multer upload instance
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      // Validate file type against allowed types
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;