const express = require("express");
const {
  createSession,
  paymentSuccess,
} = require("../controllers/payment.controller");
const verifyFBToken = require("../../middlewares/verifyFBToken");
const verifyActiveOrSuspended = require("../../middlewares/verifyActiveOrSuspended");

const router = express.Router();

router.post(
  "/create-session",
  verifyFBToken,
  verifyActiveOrSuspended,
  createSession,
);
router.patch("/payment-success", paymentSuccess);

module.exports = router;
