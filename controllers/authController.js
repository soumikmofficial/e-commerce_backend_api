const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

// ..........................register............................
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "admin" : "user";

  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError.BadRequestError("User is alredy registered");
  }

  const newUser = await User.create({ name, email, password, role });

  attachCookiesToResponse({ res, user: createTokenUser(user) });

  res.status(StatusCodes.CREATED).json({ success: true, user: newUser });
};

// ..............................login...........................
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError.UnauthorizedError(`Login Unsuccessful`);
  }
  const isMatch = await user.verifyPassword(password);

  if (!isMatch) {
    throw new CustomError.UnauthorizedError(`Login Unsuccessful`);
  }

  attachCookiesToResponse({ res, user: createTokenUser(user) });

  res.status(StatusCodes.OK).json({ message: "logged in succcessfully" });
};

// ..............logout.............................
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "logged out succcessfully" });
};

module.exports = { login, logout, register };
