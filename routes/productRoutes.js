const express = require("express");
const router = express.Router();
const {
  authentication,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post(authentication, authorizePermissions("admin"), createProduct);
router
  .route("/upload")
  .post(authentication, authorizePermissions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authentication, authorizePermissions("admin"), updateProduct)
  .delete(authentication, authorizePermissions("admin"), deleteProduct);
router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
