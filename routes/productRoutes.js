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

router
  .route("/")
  .get(getAllProducts)
  .post(authentication, authorizePermissions, createProduct);
router.route("/upload").post(authentication, authorizePermissions, uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authentication, authorizePermissions, updateProduct)
  .delete(authentication, authorizePermissions, deleteProduct);

module.exports = router;
