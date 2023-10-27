const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Friend = require("../models/Friend");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const postController = {};
const calculatePostCount = async (userId) => {
    const postCount = await Post.countDocuments({
        author: userId,
        isDeleted: false,
    });
    await User.findByIdAndUpdate(userId, { postCount });
};
postController.createPost = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { content, image } = req.body;
    // Business Logic Validation

    // Process
    let post = await Post.create({ content, image, author: currentUserId });
    //update postCount in UserInfo
    await calculatePostCount(currentUserId);
    //populate author field
    post = await post.populate("author");

    //Response
    return sendResponse(res, 201, true, post, null, "Create Post Successful");
});
postController.getPosts = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;
    const user = await User.findById(targetUserId);
    if (!user)
        throw new AppError(401, "User not found", "Get Post By User Error");

    let { page, limit } = { ...req.query };
    // Business Logic Validation
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    // Process
    let userFriendIDs = await Friend.find({
        $or: [
            { from: targetUserId, status: "accepted" },
            { to: targetUserId, status: "accepted" },
        ],
    });
    if (userFriendIDs && userFriendIDs.length) {
        userFriendIDs = userFriendIDs.map((friend) => {
            //save the ID of friends
            if (friend.from._id.equals(targetUserId)) return friend.to;
            return friend.from;
        });
    } else {
        userFriendIDs = [];
    }
    userFriendIDs = [...userFriendIDs, targetUserId];
    const filterConditions = [
        { isDeleted: false },
        { author: { $in: userFriendIDs } },
    ];

    let filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    const count = await Post.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let posts = await Post.find(filterCriteria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("author");

    //Response
    return sendResponse(
        res,
        200,
        true,
        { posts, totalPages, count },
        null,
        "Get posts successful"
    );
    //
});
postController.getSinglePost = catchAsync(async (req, res, next) => {
    //Get data from request
    const postId = req.params.id;
    // Business Logic Validation
    let post = await Post.findOne({ _id: postId, isDeleted: false });

    if (!post) throw new AppError(401, "Post not found", "Get Post Error");
    // Process
    //get comment and author
    post = post.toJSON();
    post.comments = await Comment.find({ post: post._id }).populate("author");

    //Response
    return sendResponse(
        res,
        200,
        true,
        post,
        null,
        "Get Single Post Successful"
    );
});
postController.updateSinglePost = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const postId = req.params.id;

    // Business Logic Validation
    let post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new AppError(401, "Post not found", "Update Post Error");
    if (!post.author.equals(currentUserId))
        throw new AppError(
            401,
            "Only author can edit post",
            "Update Post Error"
        );
    // Process
    const allows = ["content", "image"];
    allows.forEach((field) => {
        if (req.body[field] !== undefined) {
            post[field] = req.body[field];
        }
    });

    await post.save();

    //Response
    return sendResponse(res, 200, true, post, null, "Update Post Successful");
});
postController.deleteSinglePost = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const postId = req.params.id;

    // Business Logic Validation
    let post = await Post.findOneAndUpdate(
        { _id: postId, author: currentUserId },
        { isDeleted: true },
        { new: true }
    );
    if (!post)
        throw new AppError(
            401,
            "Post not found or User not authorize",
            "Delete Post Error"
        );

    //update post count
    await calculatePostCount(currentUserId);

    //Response
    return sendResponse(res, 200, true, post, null, "Delete Post Successful");
});

module.exports = postController;
