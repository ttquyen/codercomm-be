const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const userController = require("../controllers/user.controller");
/**
 * @route POST /users
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */
router.post(
    "/",
    validators.validate([
        body("name", "Invalid Name").exists().notEmpty(),
        body("email", "Invalid Email")
            .exists()
            .isEmail()
            .normalizeEmail({ gmail_remove_dots: false }),
        body("password", "Invalid Password").exists().notEmpty(),
    ]),
    userController.register
);
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
