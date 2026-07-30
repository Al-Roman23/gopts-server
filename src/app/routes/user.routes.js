const express = require("express");
const UserController = require("../controllers/user.controller");
const verifyFBToken = require("../../middlewares/verifyFBToken");
const verifyAdmin = require("../../middlewares/verifyAdmin");
const verifyActiveOrSuspended = require("../../middlewares/verifyActiveOrSuspended");

const router = express.Router();

router.post("/", UserController.createUser);
router.get("/", verifyFBToken, verifyAdmin, UserController.getAllUsers);
router.get(
  "/:email/role",
  verifyFBToken,
  verifyActiveOrSuspended,
  UserController.getUserRole,
);
router.get(
  "/:uid",
  verifyFBToken,
  verifyActiveOrSuspended,
  UserController.getUserByUid,
);
router.patch(
  "/:id/role",
  verifyFBToken,
  verifyAdmin,
  UserController.updateUserRole,
);
router.patch(
  "/:id/suspend",
  verifyFBToken,
  verifyAdmin,
  UserController.suspendUser,
);
router.patch(
  "/:id/status",
  verifyFBToken,
  verifyAdmin,
  UserController.updateUserStatus,
);
router.get(
  "/me/status",
  verifyFBToken,
  verifyActiveOrSuspended,
  UserController.getMyStatus,
);

module.exports = router;
