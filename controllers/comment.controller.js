const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const commentController = {};
const calculateCommentCount = async (postId) => {
    const commentCount = await Comment.countDocuments({
        post: postId,
        isDeleted: false,
    });
    await Post.findByIdAndUpdate(postId, { commentCount });
};
commentController.createComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { content, postId } = req.body;
    // Check already exist

    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post)
        throw new AppError(400, "Post not found", "Create new comment error");

    // Create a new comment
    let comment = await Comment.create({
        content: content,
        post: postId,
        author: currentUserId,
    });
    //update comment count in a post
    await calculateCommentCount(postId);
    comment = await comment.populate("author");
    //Response
    return sendResponse(
        res,
        200,
        true,
        comment,
        null,
        "Create Comment Successful"
    );
});
commentController.getSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOne({
        _id: commentId,
        author: currentUserId,
        isDeleted: false,
    });
    if (!comment)
        throw new AppError(
            400,
            "Comment not found or User not Authorize",
            "Get single comment error"
        );
    //Response
    return sendResponse(res, 200, true, comment, null, " Successful");
});
commentController.updateSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { content } = req.body;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            author: currentUserId,
            isDeleted: false,
        },
        { content },
        { new: true }
    );
    if (!comment)
        throw new AppError(
            400,
            "Comment not found or User not Authorize",
            "Update comment error"
        );

    //Response
    return sendResponse(
        res,
        200,
        true,
        comment,
        null,
        "Update Comment Successful"
    );
});
commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const commentId = req.params.id;
    // Check already exist
    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        author: currentUserId,
    });
    if (!comment)
        throw new AppError(
            400,
            "Comment not found or User not Authorize",
            "Delete comment error"
        );
    calculateCommentCount(comment.post);
    //Response
    return sendResponse(res, 200, true, comment, null, " Successful");
});

module.exports = commentController;
