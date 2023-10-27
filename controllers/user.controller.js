const User = require("../models/User");
const Friend = require("../models/Friend");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
    //Get data from request
    let { name, email, password } = req.body;

    // Business Logic Validation
    //check already exist
    let user = await User.findOne({ email });
    if (user)
        throw new AppError(400, "User already exist", "Registration Error");

    // Process

    //crypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password });

    const accessToken = await user.generateToken();
    //Response
    sendResponse(
        res,
        201,
        true,
        { user, accessToken },
        null,
        "Create User Successful"
    );
});

userController.getUsers = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const user = await User.findById(currentUserId);
    if (!user)
        throw new AppError(401, "User not found", "Get Current User Error");

    let { page, limit, ...filter } = { ...req.query };
    // Business Logic Validation
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    // Process
    const filterConditions = [{ isDeleted: false }];
    if (filter.name) {
        filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
    }

    let filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let users = await User.find(filterCriteria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    const promises = users.map(async (targetUser) => {
        //cast targetUser to json
        let tmpUser = targetUser.toJSON();
        //check relationship
        tmpUser.friendship = await Friend.findOne({
            $or: [
                { from: currentUserId, to: targetUser._id },
                { from: targetUser._id, to: currentUserId },
            ],
        });
        return tmpUser;
    });

    const userWithFriendship = await Promise.all(promises);

    //Response
    sendResponse(
        res,
        200,
        true,
        { users: userWithFriendship, totalPages, count },
        null,
        "Get users successful"
    );
    //
});
//when user refresh page => client will get accessToken in the local storage to get user info
userController.getCurrentUser = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    // Business Logic Validation
    const user = await User.findById(currentUserId);
    if (!user)
        throw new AppError(401, "User not found", "Get Current User Error");
    // Process

    //Response
    sendResponse(res, 200, true, user, null, "Get current user successful");
});
userController.getSingleUser = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const targetUserId = req.params.id;
    // Business Logic Validation
    let user = await User.findById(targetUserId);

    if (!user) throw new AppError(401, "User not found", "Get User Error");
    // Process
    //cast user to json
    user = user.toJSON();
    //check relationship
    user.friendship = await Friend.findOne({
        $or: [
            { from: currentUserId, to: targetUserId },
            { from: targetUserId, to: currentUserId },
        ],
    });

    //Response
    sendResponse(res, 200, true, user, null, "Get Single User Successful");
});
userController.updateProfile = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const targetUserId = req.params.id;

    // Business Logic Validation
    if (currentUserId !== targetUserId) {
        throw new AppError(400, "Permission required", "Update Profile Error");
    }

    let user = await User.findById(targetUserId);
    if (!user)
        throw new AppError(401, "User not found", "Get Current User Error");
    // Process
    const allows = [
        "name",
        "avatarUrl",
        "coverUrl",
        "aboutMe",
        "city",
        "country",
        "company",
        "jobTitle",
        "facebookLink",
        "instagramLink",
        "linkedinLink",
        "twitterLink",
    ];
    allows.forEach((field) => {
        if (req.body[field] !== undefined) {
            user[field] = req.body[field];
        }
    });

    await user.save();

    //Response
    sendResponse(res, 200, true, user, null, "Update User Successful");
});

module.exports = userController;
