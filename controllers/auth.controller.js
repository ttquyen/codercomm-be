const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
    //Get data from request
    const { email, password } = req.body;

    // Business Logic Validation
    //check match email
    const user = await User.findOne({ email }, "+password");
    if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

    // Process
    //crypt and compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
    //generate Token
    const accessToken = await user.generateToken();

    //Response
    sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login Successful"
    );
});
module.exports = authController;
