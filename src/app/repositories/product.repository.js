const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class ProductRepository {
  async createProduct(product) {
    const products = await getCollection("products");
    return products.insertOne({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async getAllProducts(filter = {}) {
    const products = await getCollection("products");
    return products.find(filter).toArray();
  }
  async findById(productId) {
    const products = await getCollection("products");
    return products.findOne({ _id: new ObjectId(productId) });
  }
  async update(productId, updateObj) {
    const products = await getCollection("products");
    updateObj.updatedAt = new Date();
    return products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateObj },
    );
  }
  async delete(productId) {
    const products = await getCollection("products");
    return products.deleteOne({ _id: new ObjectId(productId) });
  }
  // Update Manager Show On Home
  async updateManagerShowOnHome(productId, show) {
    const products = await getCollection("products");
    return products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { managerShowOnHome: show, updatedAt: new Date() } }
    );
  }

  // Update Admin Show On Home
  async updateAdminShowOnHome(productId, show) {
    const products = await getCollection("products");
    return products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { adminShowOnHome: show, updatedAt: new Date() } }
    );
  }

  // Update Is Visible In All Products
  async updateIsVisibleInAllProducts(productId, show) {
    const products = await getCollection("products");
    return products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { isVisibleInAllProducts: show, updatedAt: new Date() } }
    );
  }
  async getByManager(managerEmail, filter = {}, skip = 0, limit = 20) {
    const products = await getCollection("products");
    const fullFilter = { ...filter, createdBy: managerEmail };
    const result = await products
      .find(fullFilter)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await products.countDocuments(fullFilter);
    return { products: result, total };
  }
}

module.exports = new ProductRepository();
