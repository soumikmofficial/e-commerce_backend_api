const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// ................all users.......................
const getAllUsers = async (req, res) => {
  console.log(`the user is ${req.user.name}`);
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
  res.status(StatusCodes.OK).json({ success: true, user });
};

// .....................update user......................
const updateUser = async (req, res) => {
  res.send("Updated User");
};
const updateUserPassword = async (req, res) => {
  res.send("Update Pasword");
};
const showCurrentUser = async (req, res) => {
  res.send("Showing current user");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};
