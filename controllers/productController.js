const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { findOneAndUpdate } = require("../models/Product");

// ................all products.......................
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: products.length, products });
};

// .................single product......................
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(
      `Coldn't find product with id: ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

// .................create product........................
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const createdProduct = await Product.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, product: createdProduct });
};

// .....................update product......................
const updateProduct = async (req, res) => {
  const product = await findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

// ....................delete product .............................
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(
      `Coldn't find product with id: ${req.params.id}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({
    success: true,
    message: `removed prduct with the id of ${req.params.id}`,
  });
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
