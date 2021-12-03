const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

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
  req.body.user = req.user.userId;
  const createdReview = await Review.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, review: createdReview });
};

// .....................update review......................
const updateReview = async (req, res) => {
  const review = await findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    throw new CustomError.NotFoundError("Review not found");
  }
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
  await review.remove();
  res.status(StatusCodes.OK).json({
    success: true,
    message: `removed prduct with the id of ${req.params.id}`,
  });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  createReview,
  deleteReview,
};
