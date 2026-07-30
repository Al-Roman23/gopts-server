const OrderRepository = require("../repositories/order.repository");
const { NotFound, BadRequest } = require("../../core/errors/errors");
const generateTrackingId = require("../../utils/generateTrackingId");
const orderLogService = require("../../modules/order/orderLog.service");
const OrderLogMessages = require("../../modules/order/orderLog.messages");

class OrderService {
  async createOrder(order, actor) {
    const trackingId = await generateTrackingId("GOPTS");

    const orderData = {
      ...order,
      trackingId,
      paymentStatus: "unpaid",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await OrderRepository.createOrder(orderData);

    await orderLogService.log({
      trackingId,
      orderId: result.insertedId,
      type: "ORDER",
      status: "CREATED",
      message: OrderLogMessages.orderCreated(orderData),
      by: {
        role: actor?.role || "user",
        email: actor?.email || orderData.userEmail,
      },
    });

    return result;
  }

  async getAllOrders({ status, userEmail, page = 1, limit = 20 } = {}) {
    const filter = {};

    if (status) filter.status = status.toLowerCase();
    if (userEmail) filter.userEmail = userEmail;

    const skip = (page - 1) * limit;

    const orders = await OrderRepository.getAllOrders({
      filter,
      skip,
      limit,
    });

    const total = await OrderRepository.getOrdersCount(filter);

    return { orders, total, page, limit };
  }

  async getOrderById(orderId) {
    const order = await OrderRepository.getOrderById(orderId);
    if (!order) throw new NotFound("Order not found!");
    return order;
  }

  async updateOrderStatus(orderId, status) {
    const result = await OrderRepository.updateOrderStatus(orderId, { status });
    if (result.modifiedCount === 0)
      throw new NotFound("Order not found or status unchanged!");
    return result;
  }

  async approveOrder(orderId, manager) {
    const order = await OrderRepository.getOrderById(orderId);
    if (!order) throw new NotFound("Order not found!");

    await OrderRepository.updateOrderStatus(orderId, {
      status: "approved",
      approvedAt: new Date(),
    });

    await orderLogService.log({
      trackingId: order.trackingId,
      orderId: order._id,
      type: "ORDER",
      status: "APPROVED",
      message: OrderLogMessages.orderApproved(manager.email),
      by: { role: "manager", email: manager.email },
    });
  }

  async rejectOrder(orderId, reason, manager) {
    const order = await OrderRepository.getOrderById(orderId);
    if (!order) throw new NotFound("Order not found!");

    await OrderRepository.updateOrderStatus(orderId, {
      status: "rejected",
      rejectedAt: new Date(),
      rejectedReason: reason,
    });

    await orderLogService.log({
      trackingId: order.trackingId,
      orderId: order._id,
      type: "ORDER",
      status: "REJECTED",
      message: OrderLogMessages.orderRejected(manager.email, reason),
      by: { role: "manager", email: manager.email },
    });
  }

  async addTrackingLog(orderId, log) {
    const order = await OrderRepository.getOrderById(orderId);
    if (!order || order.status !== "approved")
      throw new BadRequest("Approved order not found!");

    if (!log.createdAt) log.createdAt = new Date();
    return OrderRepository.pushTrackingLog(orderId, log);
  }

  async getOrdersByUser(userEmail, page = 1, limit = 20) {
    const orders = await OrderRepository.getOrdersByUser(userEmail);
    return { orders, total: orders.length, page, limit };
  }

  async getOrderByTrackingId(trackingId) {
    const order = await OrderRepository.getOrderByTrackingId(trackingId);
    if (!order) throw new NotFound("Order not found!");
    return order;
  }

  async deleteOrder(orderId) {
    const result = await OrderRepository.deleteOrder(orderId);
    if (result.deletedCount === 0) throw new NotFound("Order not found!");
    return result;
  }

  async getPendingOrdersByManager(managerEmail, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const orders = await OrderRepository.getOrdersByManager(
      managerEmail,
      "pending",
      skip,
      limit,
    );

    const total = await OrderRepository.countOrdersByManager(
      managerEmail,
      "pending",
    );

    return { orders, total, page, limit };
  }

  async getApprovedOrdersByManager(managerEmail, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const orders = await OrderRepository.getOrdersByManager(
      managerEmail,
      "approved",
      skip,
      limit,
    );

    const total = await OrderRepository.countOrdersByManager(
      managerEmail,
      "approved",
    );

    return { orders, total, page, limit };
  }
}

module.exports = new OrderService();
