const express = require("express");
const router = express.Router();
/**
 * @route POST /users
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */

/**
 * @route GET /users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 */

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */

/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */

/**
 * @route PUT /users/:id
 * @description Update a user profile
 * @access Login required
 */
module.exports = router;
