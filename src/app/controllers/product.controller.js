const ProductService = require("../services/product.service");
const { BadRequest } = require("../../core/errors/errors");
const { validateProduct } = require("../validators/product.validator");

class ProductController {
  async addProduct(req, res, next) {
    try {
      const productData = {
        ...req.body,
        managerShowOnHome: Boolean(req.body.managerShowOnHome), // Map To managerShowOnHome
        createdBy: req.decoded_email,
      };
      const validation = validateProduct(productData);
      if (!validation.valid) throw new BadRequest(validation.message);
      const result = await ProductService.createProduct(productData);
      res.status(201).json({
        message: "Product added successfully! Pending Admin Approval.",
        id: result.insertedId,
      });
    } catch (err) {
      next(err);
    }
  }

  // Public Get All Products (Strict Filter)
  async getAllProducts(req, res, next) {
    try {
      res.json(await ProductService.getPublicProducts(req.query));
    } catch (err) {
      next(err);
    }
  }

  // Admin Get All Products (Raw List)
  async getAllProductsForAdmin(req, res, next) {
    try {
      res.json(await ProductService.getAdminAllProducts(req.query));
    } catch (err) {
      next(err);
    }
  }

  // Public Get Home Products
  async getHomeProducts(req, res, next) {
    try {
        res.json(await ProductService.getHomeProducts());
    } catch (err) {
        next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      res.json(await ProductService.findById(req.params.productId));
    } catch (err) {
      next(err);
    }
  }

  async getMyProducts(req, res, next) {
    try {
      const managerEmail = req.decoded_email;
      const { page = 1, limit = 20, category, managerShowOnHome } = req.query;
      const filter = { createdBy: managerEmail };
      if (category) filter.category = category;
      // Filter By managerShowOnHome
      if (managerShowOnHome !== undefined) filter.managerShowOnHome = managerShowOnHome === "true";
      
      res.json(
        await ProductService.getProductsByManager(
          managerEmail,
          filter,
          Number(page),
          Number(limit),
        )
      );
    } catch (err) {
      next(err);
    }
  }

  async getMyProductById(req, res, next) {
    try {
      const product = await ProductService.findByIdForManager(
        req.params.productId,
        req.decoded_email,
      );
      if (!product)
        return res.status(404).json({ message: "Product not found!" });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async updateMyProduct(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequest("Update data cannot be empty!");
      await ProductService.updateProduct(
        req.params.productId,
        req.body,
        req.decoded_email,
      );
      res.json({ message: "Product updated! Approval reset to Pending." });
    } catch (err) {
      next(err);
    }
  }

  async deleteMyProduct(req, res, next) {
    try {
      await ProductService.deleteProduct(
        req.params.productId,
        req.decoded_email,
      );
      res.json({ message: "Product deleted successfully!" });
    } catch (err) {
      next(err);
    }
  }

  // Admin Only: Update Product
  async updateProduct(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequest("Update data cannot be empty!");
      await ProductService.adminUpdateProduct(req.params.productId, req.body);
      res.json({ message: "Product updated successfully!" });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.productId);
      res.json({ message: "Product deleted successfully!" });
    } catch (err) {
      next(err);
    }
  }

  // Admin Only: Toggle Admin Home Visibility
  async toggleAdminShowOnHome(req, res, next) {
    try {
      if (typeof req.body.show !== "boolean")
        throw new BadRequest("Show must be boolean!");
      await ProductService.updateAdminShowOnHome(
        req.params.productId,
        req.body.show,
      );
      res.json({ message: "Home visibility updated!" });
    } catch (err) {
      next(err);
    }
  }

   // Admin Only: Toggle All Products Visibility
   async toggleIsVisibleInAllProducts(req, res, next) {
    try {
      if (typeof req.body.show !== "boolean")
        throw new BadRequest("Show must be boolean!");
      await ProductService.updateIsVisibleInAllProducts(
        req.params.productId,
        req.body.show,
      );
      res.json({ message: "All Products visibility updated!" });
    } catch (err) {
      next(err);
    }
  }

  // Admin Only: Get Pending Products
  async getPendingProducts(req, res, next) {
    try {
        res.json(await ProductService.getPendingProducts());
    } catch (err) {
        next(err);
    }
  }
}

module.exports = new ProductController();
