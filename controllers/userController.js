const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser } = require("../utils");

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
  createTokenUser(user);
  if (!user) {
    throw new CustomError.NotFoundError("User does not exist");
  }
  res.status(StatusCodes.OK).json({ success: true, user });
};

// .....................update user......................
const updateUser = async (req, res) => {
  res.send("Updated User");
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
  user.save();
  res.status(StatusCodes.OK).json({ message: `password updated successfully` });
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
