const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const postController = require("../controllers/post.controller");
/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */
router.get(
    "/user/:userId",
    authentication.loginRequired,
    validators.validate([
        param("userId").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.getPosts
);
/**
 * @route POST /posts
 * @description Create a new post
 * @body {content, image}
 * @access Login required
 */
router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
        body("content", "Missing Content").exists().notEmpty(),
    ]),
    postController.createPost
);
/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access Login required
 */
router.get(
    "/:id",
    authentication.loginRequired,
    //validator param in url
    //use custom because of using self-defined function
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.getSinglePost
);
/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */
router.put(
    "/:id",
    authentication.loginRequired,
    //validator param in url
    //use custom because of using self-defined function
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.updateSinglePost
);
/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */

router.delete(
    "/:id",
    authentication.loginRequired,
    //validator param in url
    //use custom because of using self-defined function
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.deleteSinglePost
);

/**
 * @route GET /posts/:id/comments
 * @description Get comments of a post
 * @access Login required
 */
router.get(
    "/:id/comments",
    authentication.loginRequired,
    //validator param in url
    //use custom because of using self-defined function
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.getCommentsOfPost
);
module.exports = router;
