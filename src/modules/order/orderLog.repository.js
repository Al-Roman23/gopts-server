// Repository For Managing Orders
const { getCollection } = require("../../config/db");

class OrderRepository {
  async findByTrackingId(trackingId) {
    const orders = await getCollection("orders");
    return orders.findOne({ trackingId });
  }

  async updateOrderTrackingLogs(trackingId, logEntry) {
    const orders = await getCollection("orders");
    return orders.updateOne(
      { trackingId },
      { $push: { trackingLogs: logEntry } },
    );
  }
}

module.exports = new OrderRepository();
