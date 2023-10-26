const User = require("../models/User");
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

module.exports = userController;
