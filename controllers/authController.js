const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utils");

const login = (req, res) => {
  res.status(200).json({ message: "logged in succcessfully" });
};
const logout = (req, res) => {
  res.status(200).json({ message: "logged out succcessfully" });
};
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "admin" : "user";

  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError.BadRequestError("User is alredy registered");
  }

  const newUser = await User.create({ name, email, password, role });

  attachCookiesToResponse({ res, user: newUser });

  res.status(StatusCodes.CREATED).json({ success: true, user: newUser });
};

module.exports = { login, logout, register };
