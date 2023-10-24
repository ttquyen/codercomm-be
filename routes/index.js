var express = require("express");
var router = express.Router();

//auth APIs
const authApi = require("./auth.api");
router.use("/auth", authApi);
//user APIs
const userApi = require("./user.api");
router.use("/users", userApi);
//post APIs
const postApi = require("./post.api");
router.use("/posts", postApi);
//comment APIs
const commentApi = require("./comment.api");
router.use("/comments", commentApi);
//reaction APIs
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);
//friend APIs
const friendApi = require("./friend.api");
router.use("/friends", friendApi);

module.exports = router;
/**
 * @route POST /auth/login - Login with username and password
 *
 * @route POST /users - Register a new user
 * @route GET /users?page=1&limit=10 - Get users with pagination
 * @route GET /users/me - Get current user info
 * @route GET /users/:id - Get a user profile
 * @route PUT /users/:id - Update a user profile
 *
 * **/
