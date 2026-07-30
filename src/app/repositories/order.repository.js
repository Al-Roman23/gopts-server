const { ObjectId } = require("mongodb");
const { getCollection } = require("../../config/db");

class OrderRepository {
  async createOrder(order) {
    const orders = await getCollection("orders");

    return orders.insertOne({
      ...order,
      createdAt: new Date(),
      trackingLogs: [],
    });
  }

  async getAllOrders({ filter = {}, skip = 0, limit = 20 } = {}) {
    const orders = await getCollection("orders");

    return orders
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async getOrdersCount(filter = {}) {
    const orders = await getCollection("orders");
    return orders.countDocuments(filter);
  }

  async getOrderById(id) {
    const orders = await getCollection("orders");
    return orders.findOne({ _id: new ObjectId(id) });
  }

  async updateOrderStatus(id, updateObj) {
    const orders = await getCollection("orders");

    return orders.updateOne({ _id: new ObjectId(id) }, { $set: updateObj });
  }

  async pushTrackingLog(orderId, log) {
    const orders = await getCollection("orders");

    return orders.updateOne(
      { _id: new ObjectId(orderId), status: "approved" },
      { $push: { trackingLogs: log } },
    );
  }

  async getOrdersByUser(userEmail) {
    const orders = await getCollection("orders");

    return orders.find({ userEmail }).sort({ createdAt: -1 }).toArray();
  }

  async getOrderByTrackingId(trackingId) {
    const orders = await getCollection("orders");
    return orders.findOne({ trackingId });
  }

  async deleteOrder(orderId) {
    const orders = await getCollection("orders");

    return orders.deleteOne({
      _id: new ObjectId(orderId),
    });
  }

  async getOrdersByManager(managerEmail, status, skip = 0, limit = 10) {
    const orders = await getCollection("orders");

    return orders
      .find({ managerEmail, status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async countOrdersByManager(managerEmail, status) {
    const orders = await getCollection("orders");
    return orders.countDocuments({ managerEmail, status });
  }
}

module.exports = new OrderRepository();
