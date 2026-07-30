const ProductRepository = require("../repositories/product.repository");
const { NotFound } = require("../../core/errors/errors");

class ProductService {
  // Create Product With Default Pending Status
  async createProduct(product) {
    const productData = {
      ...product,
      approvalStatus: "pending", // Default Pending
      managerShowOnHome: product.managerShowOnHome || false,
      adminShowOnHome: false, // Admin Must Approve
      isVisibleInAllProducts: false, // Admin Must Approve
      lastUpdatedBy: "manager",
    };
    return ProductRepository.createProduct(productData);
  }

  // Get Public Products For All Products Page
  async getPublicProducts(filter = {}) {
    // Strict Filter For Public Visibility
    const publicFilter = {
      ...filter,
      approvalStatus: "approved",
      isVisibleInAllProducts: true,
    };
    return ProductRepository.getAllProducts(publicFilter);
  }

  // Get All Products For Admin (No Strict Filter)
  async getAdminAllProducts(filter = {}) {
    return ProductRepository.getAllProducts(filter);
  }

  // Get Public Products For Home Page
  async getHomeProducts() {
    // Strict Filter For Home Visibility
    const filter = {
      approvalStatus: "approved",
      managerShowOnHome: true,
      adminShowOnHome: true,
    };
    return ProductRepository.getAllProducts(filter);
  }

  // Get Pending Products For Admin
  async getPendingProducts() {
    return ProductRepository.getAllProducts({ approvalStatus: "pending" });
  }

  async findById(productId) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");
    return product;
  }

  async findByIdForManager(productId, managerEmail) {
    const product = await ProductRepository.findById(productId);
    if (!product || product.createdBy !== managerEmail) return null;
    return product;
  }

  // Update Product By Manager (Triggers Re-Approval)
  async updateProduct(productId, updateObj, managerEmail = null) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");
    if (managerEmail && product.createdBy !== managerEmail)
      throw new NotFound("Product not found for this manager!");

    const updateData = {
      ...updateObj,
      approvalStatus: "pending", // Reset To Pending
      adminShowOnHome: false, // Revoke Home Visibility
      isVisibleInAllProducts: false, // Revoke All Products Visibility
      lastUpdatedBy: "manager",
    };

    // Manager Can Only Update Their Own Flags
    if (updateObj.managerShowOnHome !== undefined) {
      updateData.managerShowOnHome = updateObj.managerShowOnHome;
    }

    return ProductRepository.update(productId, updateData);
  }

  // Admin Update Product (No Re-Approval Needed)
  async adminUpdateProduct(productId, updateObj) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");

    const updateData = {
      ...updateObj,
      lastUpdatedBy: "admin",
      lastApprovedAt: updateObj.approvalStatus === "approved" ? new Date() : product.lastApprovedAt,
    };
    return ProductRepository.update(productId, updateData);
  }

  async deleteProduct(productId, managerEmail = null) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");
    if (managerEmail && product.createdBy !== managerEmail)
      throw new NotFound("Product not found for this manager!");
    return ProductRepository.delete(productId);
  }

  // Toggle Manager Show On Home
  async updateManagerShowOnHome(productId, show) {
     return ProductService.updateProduct(productId, { managerShowOnHome: show });
  }

  // Admin Toggle Home Visibility
  async updateAdminShowOnHome(productId, show) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");
    return ProductRepository.updateAdminShowOnHome(productId, show);
  }

   // Admin Toggle All Products Visibility
   async updateIsVisibleInAllProducts(productId, show) {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFound("Product not found!");
    return ProductRepository.updateIsVisibleInAllProducts(productId, show);
  }

  async getProductsByManager(managerEmail, filter = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return ProductRepository.getByManager(managerEmail, filter, skip, limit);
  }
}

module.exports = new ProductService();
