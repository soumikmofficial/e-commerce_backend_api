const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

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
  const { tax, shippingFee, cartItems } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(
      `Cannot create order with an empty cart`
    );
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(`Tax/ShippingFee is missing`);
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with the id: ${item.product}`
      );
    }
    const { name, image, price, _id } = dbProduct;
    const singleOrderItem = {
      name,
      price,
      image,
      product: _id,
      //amount is coming from front end
      amount: item.amount,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    cartItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
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
