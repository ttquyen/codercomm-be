const Friend = require("../models/Friend");
const User = require("../models/User");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const friendController = {};
const calculateFriendCount = async (userId) => {
    const friendCount = await Friend.countDocuments({
        $or: [{ from: userId }, { to: userId }],
        status: "accepted",
    });
    await User.findByIdAndUpdate(userId, { friendCount });
};

friendController.sendFriendRequest = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const toUserId = req.body.to;
    // Business Logic Validation
    const user = await User.findById(toUserId);
    if (!user)
        throw new AppError(400, "User Not Found", "Send Friend Request Error");

    //check friend request already exist

    let friend = await Friend.findOne({
        $or: [
            { from: toUserId, to: currentUserId },
            { from: currentUserId, to: toUserId },
        ],
    });

    if (!friend) {
        //create a new friend request
        friend = await Friend.create({
            from: currentUserId,
            to: toUserId,
            status: "pending",
        });
    } else {
        // if status===pending -> error:already sent
        // if status===accepted -> error:already friend
        // if status===declined -> update status to pending
        switch (friend.status) {
            case "pending":
                if (friend.from.equals(currentUserId)) {
                    throw new AppError(
                        400,
                        "You have already sent a request to this user",
                        "Sent Friend Eequest Error"
                    );
                } else {
                    throw new AppError(
                        400,
                        "You have recieved a request from this user",
                        "Sent Friend Eequest Error"
                    );
                }
            case "accepted":
                throw new AppError(
                    400,
                    "Users are already friend",
                    "Sent Friend Eequest Error"
                );
            case "declined":
                friend.from = currentUserId;
                friend.to = toUserId;
                friend.status = "pending";
                await friend.save();
                return sendResponse(
                    res,
                    200,
                    true,
                    friend,
                    null,
                    "Sent Friend Request Successful"
                );
            default:
                throw new AppError(
                    400,
                    "Friend status is undefined",
                    "Sent Friend Eequest Error"
                );
        }
    }
    // Process
    return sendResponse(
        res,
        200,
        true,
        friend,
        null,
        "Sent Friend Request Successful"
    );

    //Response
});
friendController.getReceivedFriendRequestList = catchAsync(
    async (req, res, next) => {
        //Get data from request
        let { page, limit, ...filter } = { ...req.query };
        const currentUserId = req.userId; //From
        let requestList = await Friend.find({
            to: currentUserId,
            status: "pending",
        });
        const requesterIDs = requestList.map((friend) => friend.from);
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        // Process
        const filterConditions = [{ _id: { $in: requesterIDs } }];
        if (filter.name) {
            filterConditions.push({
                name: { $regex: filter.name, $options: "i" },
            });
        }
        let filterCriteria = filterConditions.length
            ? { $and: filterConditions }
            : {};
        const count = await User.countDocuments(filterCriteria);
        const totalPages = Math.ceil(count / limit);
        const offset = limit * (page - 1);

        const users = await User.find(filterCriteria)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        const userWithFriendship = users.map((targetUser) => {
            //cast targetUser to json
            let tmpUser = targetUser.toJSON();
            //check relationship
            tmpUser.friendship = requestList.find((friendship) => {
                if (
                    friendship.from.equals(targetUser._id) ||
                    friendship.to.equals(targetUser._id)
                ) {
                    return { status: friendship.status };
                }
                return false;
            });
            return tmpUser;
        });

        //Response
        sendResponse(
            res,
            200,
            true,
            { users: userWithFriendship, totalPages, count },
            null,
            "Get Outgoing Request List Successful"
        );
        //
    }
);
friendController.getSentFriendRequestList = catchAsync(
    async (req, res, next) => {
        //Get data from request
        let { page, limit, ...filter } = { ...req.query };
        const currentUserId = req.userId; //From
        let requestList = await Friend.find({
            from: currentUserId,
            status: "pending",
        });
        const recipientIDs = requestList.map((friend) => friend.to);
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        // Process
        const filterConditions = [{ _id: { $in: recipientIDs } }];
        if (filter.name) {
            filterConditions.push({
                name: { $regex: filter.name, $options: "i" },
            });
        }
        let filterCriteria = filterConditions.length
            ? { $and: filterConditions }
            : {};
        const count = await User.countDocuments(filterCriteria);
        const totalPages = Math.ceil(count / limit);
        const offset = limit * (page - 1);

        const users = await User.find(filterCriteria)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        const userWithFriendship = users.map((targetUser) => {
            //cast targetUser to json
            let tmpUser = targetUser.toJSON();
            //check relationship
            tmpUser.friendship = requestList.find((friendship) => {
                if (
                    friendship.from.equals(targetUser._id) ||
                    friendship.to.equals(targetUser._id)
                ) {
                    return { status: friendship.status };
                }
                return false;
            });
            return tmpUser;
        });

        //Response
        sendResponse(
            res,
            200,
            true,
            { users: userWithFriendship, totalPages, count },
            null,
            "Get Incoming Request List Successful"
        );
        //
    }
);
friendController.getFriendsList = catchAsync(async (req, res, next) => {
    //Get data from request
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId; //From
    let friendList = await Friend.find({
        $or: [{ from: currentUserId }, { to: currentUserId }],
        status: "accepted",
    });
    const friendIDs = friendList.map((friend) => {
        if (friend.from.equals(currentUserId)) return friend.to;
        return friend.from;
    });
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    // Process
    const filterConditions = [{ _id: { $in: friendIDs } }];
    if (filter.name) {
        filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
    }
    let filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
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
        "Get friend list successful"
    );
    //
});
friendController.reactFriendRequest = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId; //From
    const toUserId = req.params.userId; //To
    const { status } = req.body;
    const friend = await Friend.findOne({
        from: toUserId,
        to: currentUserId,
        status: "pending",
    });
    if (!friend)
        throw new AppError(
            400,
            "Friend Request Not Found",
            "React Friend Eequest Error"
        );

    friend.status = status;
    await friend.save();

    if (friend.status === "accepted") {
        await calculateFriendCount(currentUserId);
        await calculateFriendCount(toUserId);
    }
    //Response
    sendResponse(
        res,
        200,
        true,
        friend,
        null,
        "React Friend Request Successful"
    );
});
friendController.cancelFriendRequest = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId; //From
    const toUserId = req.params.userId; //To
    // Business Logic Validation
    const friend = await Friend.findOneAndDelete({
        from: currentUserId,
        to: toUserId,
        status: "pending",
    });
    if (!friend)
        throw new AppError(
            400,
            "Friend Request Not Found",
            "Cancel Friend Request Error"
        );

    //Response
    sendResponse(
        res,
        200,
        true,
        friend,
        null,
        "Cancel Friend Request Successful"
    );
});
friendController.removeFriend = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId; //From
    const toUserId = req.params.userId; //To
    // Business Logic Validation
    const friend = await Friend.findOneAndDelete({
        $or: [
            { from: currentUserId, to: toUserId },
            { from: toUserId, to: currentUserId },
        ],
        status: "accepted",
    });
    if (!friend)
        throw new AppError(400, "Friend Not Found", "Remove Friend Error");
    else {
        await calculateFriendCount(currentUserId);
        await calculateFriendCount(toUserId);
    }
    //Response
    sendResponse(res, 200, true, friend, null, "Remove Friend Successful");
});

module.exports = friendController;
