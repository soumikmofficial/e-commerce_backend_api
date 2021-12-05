const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

// ...................all orders...................
const getAllOrders = async (req, res) => {
  res.send("get all orders");
};

// ....................single oreder....................
const getSingleOrder = async (req, res) => {
  res.send("get single orders");
};

// .....................get current users orders.....................
const getCurrentUserOrders = async (req, res) => {
  res.send("current user");
};

// ........................create order.........................
const createOrder = async (req, res) => {
  res.send("create orders");
};

// .....................update order.............................
const updateOrder = async (req, res) => {
  res.send("update orders");
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
