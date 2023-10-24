const express = require("express");
const router = express.Router();
/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @body {targetType: 'Post' or 'Comment', targetid, emoji: 'like' or 'dislike'}
 * @access Login required
 */
module.exports = router;
