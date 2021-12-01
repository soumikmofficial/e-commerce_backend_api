const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// ................all products.......................
const getAllProducts = async (req, res) => {
  res.send("all products");
};

// .................single product......................
const getSingleProduct = async (req, res) => {
  res.send("get single product");
};

// .................create product........................
const createProduct = async (req, res) => {
  res.send("create product");
  //   res.status(StatusCodes.OK).json({ success: true });
};

// .....................update product......................
const updateProduct = async (req, res) => {
  res.send("update product");
  //   res.status(StatusCodes.OK).json({ success: true });
};

// ....................delete product .............................
const deleteProduct = async (req, res) => {
  res.send("delete product");
};

// ....................upload image ...............
const uploadImage = async (req, res) => {
  res.send("upload image");
  //   res.status(StatusCodes.OK).json({ product: req.product });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadImage,
};
