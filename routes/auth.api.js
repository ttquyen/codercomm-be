const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const authController = require("../controllers/auth.controller");
/**
 * @route POST /auth/login
 * @description Login with username and password
 * @body {email, password}
 * @access Public
 */

router.post(
    "/login",
    validators.validate([
        body("email", "Invalid Email")
            .exists()
            .isEmail()
            .normalizeEmail({ gmail_remove_dots: false }),
        body("password", "Invalid Password").exists().notEmpty(),
    ]),
    authController.loginWithEmail
);
module.exports = router;
