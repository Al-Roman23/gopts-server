// Statistics Routes - Dashboard Statistics Endpoints
const express = require("express");
const StatsController = require("../controllers/stats.controller");
const verifyFBToken = require("../../middlewares/verifyFBToken");
const verifyAdmin = require("../../middlewares/verifyAdmin");
const verifyManager = require("../../middlewares/verifyManager");
const verifyActiveOrSuspended = require("../../middlewares/verifyActiveOrSuspended");

const router = express.Router();

// Admin Statistics Routes
router.get("/admin", verifyFBToken, verifyAdmin, StatsController.getAdminStats);

router.get(
  "/admin/orders-chart",
  verifyFBToken,
  verifyAdmin,
  StatsController.getOrderChartData,
);

router.get(
  "/admin/status-distribution",
  verifyFBToken,
  verifyAdmin,
  StatsController.getOrderStatusDistribution,
);

router.get(
  "/admin/recent-orders",
  verifyFBToken,
  verifyAdmin,
  StatsController.getRecentOrders,
);

router.get(
  "/admin/revenue-chart",
  verifyFBToken,
  verifyAdmin,
  StatsController.getRevenueChartData,
);

// Manager Statistics Routes
router.get(
  "/manager",
  verifyFBToken,
  verifyActiveOrSuspended,
  verifyManager,
  StatsController.getManagerStats,
);

// Buyer Statistics Routes
router.get(
  "/buyer",
  verifyFBToken,
  verifyActiveOrSuspended,
  StatsController.getBuyerStats,
);

module.exports = router;
