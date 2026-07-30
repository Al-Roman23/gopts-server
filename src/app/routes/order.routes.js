const express = require("express");
const OrderController = require("../controllers/order.controller");
const verifyFBToken = require("../../middlewares/verifyFBToken");
const verifyAdmin = require("../../middlewares/verifyAdmin");
const verifyManager = require("../../middlewares/verifyManager");
const verifyActiveOrSuspended = require("../../middlewares/verifyActiveOrSuspended");
const verifyActive = require("../../middlewares/verifyActive");

const router = express.Router();

router.get("/public/track/:trackingId", OrderController.getOrderByTrackingId);
router.post("/", verifyFBToken, verifyActive, OrderController.createOrder);
router.get(
  "/my-orders",
  verifyFBToken,
  verifyActiveOrSuspended,
  OrderController.getMyOrders,
);
router.get(
  "/track-order/:orderId",
  verifyFBToken,
  verifyActiveOrSuspended,
  OrderController.trackOrder,
);
router.get(
  "/user/:uid",
  verifyFBToken,
  verifyActiveOrSuspended,
  OrderController.getUserOrders,
);
router.get(
  "/manager",
  verifyFBToken,
  verifyActive,
  verifyManager,
  OrderController.getManagerOrders,
);
router.get(
  "/manager/pending",
  verifyFBToken,
  verifyActiveOrSuspended,
  verifyManager,
  OrderController.getPendingOrdersForManager,
);
router.get(
  "/manager/approved",
  verifyFBToken,
  verifyActiveOrSuspended,
  verifyManager,
  OrderController.getApprovedOrdersForManager,
);
router.get(
  "/manager/order-details/:orderId",
  verifyFBToken,
  verifyManager,
  OrderController.getOrderDetails,
);
router.patch(
  "/manager/:orderId/approve",
  verifyFBToken,
  verifyActive,
  verifyManager,
  OrderController.approveOrder,
);
router.patch(
  "/manager/:orderId/reject",
  verifyFBToken,
  verifyActive,
  verifyManager,
  OrderController.rejectOrder,
);
router.post(
  "/manager/:orderId/tracking",
  verifyFBToken,
  verifyActive,
  verifyManager,
  OrderController.addTrackingLogToApprovedOrder,
);
router.get("/", verifyFBToken, verifyAdmin, OrderController.getAllOrders);
router.get(
  "/:orderId",
  verifyFBToken,
  verifyAdmin,
  OrderController.getOrderById,
);
router.patch(
  "/:orderId/status",
  verifyFBToken,
  verifyAdmin,
  OrderController.updateOrderStatus,
);
router.delete("/:orderId", verifyFBToken, OrderController.deleteOrder);

module.exports = router;
