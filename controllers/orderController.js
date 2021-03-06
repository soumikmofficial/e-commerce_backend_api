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
  const orders = await Order.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: orders.length, orders });
};

// ....................single oreder....................
const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${req.params.id}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ success: true, order });
};

// .....................get current users orders.....................
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: orders.length, orders });
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
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${req.params.id}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ success: true, order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
