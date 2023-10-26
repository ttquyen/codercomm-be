const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },

        avatarUrl: { type: String, required: true, default: "" },
        coverUrl: { type: String, required: true, default: "" },

        aboutMe: { type: String, required: true, default: "" },
        city: { type: String, required: true, default: "" },
        country: { type: String, required: true, default: "" },
        company: { type: String, required: true, default: "" },
        jobTitle: { type: String, required: true, default: "" },
        facebookLink: { type: String, required: true, default: "" },
        instagramLink: { type: String, required: true, default: "" },
        linkedinLink: { type: String, required: true, default: "" },
        twitterLink: { type: String, required: true, default: "" },

        isDeleted: { type: Boolean, default: false, select: false },
        friendCount: { type: Number, default: 0 },
        postCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
