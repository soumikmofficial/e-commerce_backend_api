const express = require("express");
const router = express.Router();
const {
  authentication,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authentication, authorizePermissions("admin"), getAllOrders)
  .post(authentication, createOrder);

router.route("/showAllMyOrders").get(authentication, getCurrentUserOrders);

router
  .route("/:id")
  .get(authentication, getSingleOrder)
  .patch(authentication, updateOrder);

module.exports = router;
