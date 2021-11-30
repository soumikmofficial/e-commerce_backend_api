const {
  authentication,
  authorizePermissions,
} = require("../middlewares/authentication");
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controllers/userController");

router
  .route("/")
  .get(authentication, authorizePermissions("admin"), getAllUsers);
router.route("/showMe").post(showCurrentUser);
router.route("/:id").get(getSingleUser);
router.route("/update").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

module.exports = router;
