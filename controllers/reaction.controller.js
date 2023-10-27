const Reaction = require("../models/Reaction");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const mongoose = require("mongoose");

const reactionController = {};

const calculateReaction = async (targetId, targetType) => {
    const stats = await Reaction.aggregate([
        {
            $match: { targetId: new mongoose.Types.ObjectId(targetId) },
        },
        {
            $group: {
                _id: "$targetId",
                like: {
                    $sum: {
                        $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
                    },
                },
                dislike: {
                    $sum: {
                        $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
                    },
                },
            },
        },
    ]);
    const reactions = {
        like: (stats[0] && stats[0].like) || 0,
        dislike: (stats[0] && stats[0].dislike) || 0,
    };
    await mongoose
        .model(targetType)
        .findOneAndUpdate({ _id: targetId, isDeleted: false }, { reactions });

    return reactions;
};
reactionController.setReaction = catchAsync(async (req, res, next) => {
    //Get data from request
    const currentUserId = req.userId;
    const { targetType, targetId, emoji } = req.body;

    //check targetType exists
    const targetObject = await mongoose
        .model(targetType)
        .findOne({ _id: targetId, isDeleted: false });

    if (!targetObject)
        throw new AppError(
            400,
            `${targetType} Not Found`,
            "Set Reaction Error"
        );

    // Business Logic Validation
    /**
     * Find the reaction if exist
     *
     * If there is no reaction in the DB => Creats a new one
     *
     * If there is a previous reaction in the DB => compare the emojis
     * * If they are the same -> delete the reaction
     * * If they are different -> update the reaction
     * */

    let reaction = await Reaction.findOne({
        targetType,
        targetId,
        author: currentUserId,
    });
    if (!reaction) {
        reaction = await Reaction.create({
            targetType,
            targetId,
            author: currentUserId,
            emoji,
        });
    } else {
        if (reaction.emoji === emoji) {
            reaction = await Reaction.deleteOne({
                targetType,
                targetId,
                author: currentUserId,
            });
        } else {
            reaction.emoji = emoji;
            await reaction.save();
        }
    }

    //Count Reaction
    const reactions = await calculateReaction(targetId, targetType);

    //Response
    return sendResponse(
        res,
        201,
        true,
        reactions,
        null,
        "Set Reaction Successful"
    );
});
module.exports = reactionController;
