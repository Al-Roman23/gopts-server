const express = require("express");
const ProductController = require("../controllers/product.controller");
const verifyFBToken = require("../../middlewares/verifyFBToken");
const verifyAdmin = require("../../middlewares/verifyAdmin");
const verifyManager = require("../../middlewares/verifyManager");
const verifyActiveOrSuspended = require("../../middlewares/verifyActiveOrSuspended");
const verifyActive = require("../../middlewares/verifyActive");

const router = express.Router();

// Public Routes
router.get("/", ProductController.getAllProducts);
router.get("/home", ProductController.getHomeProducts); // Route For Home Page

router.get(
  "/:productId",
  verifyFBToken,
  verifyActiveOrSuspended,
  ProductController.getProductById,
);

// Manager Routes
router.post(
  "/",
  verifyFBToken,
  verifyActive,
  verifyManager,
  ProductController.addProduct,
);
router.get(
  "/manager/my-products",
  verifyFBToken,
  verifyActiveOrSuspended,
  verifyManager,
  ProductController.getMyProducts,
);
router.get(
  "/manager/:productId",
  verifyFBToken,
  verifyActive,
  verifyManager,
  ProductController.getMyProductById,
);
router.patch(
  "/manager/:productId",
  verifyFBToken,
  verifyActive,
  verifyManager,
  ProductController.updateMyProduct,
);
router.delete(
  "/manager/:productId",
  verifyFBToken,
  verifyActive,
  verifyManager,
  ProductController.deleteMyProduct,
);

// Admin Routes
router.get(
  "/admin/all-products",
  verifyFBToken,
  verifyAdmin,
  ProductController.getAllProductsForAdmin
);

router.get(
  "/admin/pending",
  verifyFBToken,
  verifyAdmin,
  ProductController.getPendingProducts
);


// Admin Update (Approve/Reject/Edit)
router.patch(
  "/:productId",
  verifyFBToken,
  verifyAdmin,
  ProductController.updateProduct,
);
router.delete(
  "/:productId",
  verifyFBToken,
  verifyAdmin,
  ProductController.deleteProduct,
);

// Admin Toggles
router.patch(
  "/:productId/toggle-admin-home",
  verifyFBToken,
  verifyAdmin,
  ProductController.toggleAdminShowOnHome,
);

router.patch(
  "/:productId/toggle-all-products",
  verifyFBToken,
  verifyAdmin,
  ProductController.toggleIsVisibleInAllProducts,
);

module.exports = router;
