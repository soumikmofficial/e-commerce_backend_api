const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

// ................all users.......................
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: users.length, users });
};

// .................single user......................
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new CustomError.NotFoundError("User does not exist");
  }
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ success: true, user });
};

// .....................update user......................
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Provide all fields");
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(updatedUser);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ success: true });
};

// ....................upadate password .............................
const updateUserPassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide both old password and new password"
    );
  }
  const user = await User.findOne({ _id: userId }).select("+password");
  const isMatch = await user.verifyPassword(oldPassword);
  if (!isMatch) {
    throw new CustomError.BadRequestError("Incorrect password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ success: true });
};

// ....................show me ...............
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};
