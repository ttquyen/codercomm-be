const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const reactionController = require("../controllers/reaction.controller");

/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @body {targetType: 'Post' or 'Comment', targetid, emoji: 'like' or 'dislike'}
 * @access Login required
 */
router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
        body("targetType", "Invalid targetType")
            .exists()
            .isIn(["Post", "Comment"]),
        body("targetId", "Invalid targetId")
            .exists()
            .custom(validators.checkObjectId),
        body("emoji", "Invalid Emoji").exists().isIn(["like", "dislike"]),
    ]),
    reactionController.setReaction
);
module.exports = router;
