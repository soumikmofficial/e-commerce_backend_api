const Product = require("../models/Product");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// ................all products.......................
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate("reviews");
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: products.length, products });
};

// .................single product......................
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id: ${req.params.id}`
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
  if (!req.files) {
    throw new CustomError.BadRequestError("Please add an image file");
  }
  const imageFile = req.files.image;

  if (!imageFile.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError(
      "Only image files are accepted... please try again"
    );
  }
  const maxSize = 1024 * 1024;
  if (imageFile.size > maxSize) {
    throw new CustomError.BadRequestError("File too large to be uploaded");
  }
  const imagePath = path.join(__dirname, `../public/uploads/${imageFile.name}`);
  res.send("upload image");
  imageFile.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ success: true, image: `/uploads/${imageFile.name}` });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadImage,
};
