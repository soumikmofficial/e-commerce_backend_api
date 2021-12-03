const express = require("express");
const router = express.Router();
const { authentication } = require("../middlewares/authentication");
const {
  getAllReviews,
  getSingleReview,
  updateReview,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

router.route("/").get(getAllReviews).post(authentication, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authentication, updateReview)
  .delete(authentication, deleteReview);

module.exports = router;
