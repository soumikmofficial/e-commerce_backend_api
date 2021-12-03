const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

// ................all reviews.......................
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, total: reviews.length, reviews });
};

// .................single review......................
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError(
      `Couldn't find review with id: ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ success: true, review });
};

// .................create review........................
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  //   check if product exists
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `Product with id: ${productId} not found`
    );
  }
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError(
      "Product has already been reviewed by you"
    );
  }
  req.body.user = req.user.userId;
  const createdReview = await Review.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, review: createdReview });
};

// .....................update review......................
const updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError("Review not found");
  }
  checkPermissions(req.user, review.user);
  const { rating, title, comment } = req.body;
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ success: true, review });
};

// ....................delete review .............................
const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError(
      `Coldn't find review with id: ${req.params.id}`
    );
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({
    success: true,
    message: `removed review with the id of ${req.params.id}`,
  });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  createReview,
  deleteReview,
};
