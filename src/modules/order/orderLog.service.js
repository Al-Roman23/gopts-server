// Service To Manage Order Tracking Logs
const OrderRepository = require("../../app/repositories/order.repository");

class OrderLogService {
  async log({
    trackingId,
    orderId,
    type,
    status,
    message,
    location,
    note,
    by,
  }) {
    const logEntry = {
      trackingId,
      orderId,
      type,
      status,
      message,
      location: location || null,
      note: note || null,
      by,
      createdAt: new Date(),
    };
    await OrderRepository.pushTrackingLog(orderId, logEntry);
    return logEntry;
  }

  async getTimeline(trackingId) {
    const order = await OrderRepository.findByTrackingId(trackingId);
    return order?.trackingLogs || [];
  }

  async getLastStep(trackingId) {
    const order = await OrderRepository.findByTrackingId(trackingId);
    const trackingLogs = order?.trackingLogs || [];
    return trackingLogs.length ? trackingLogs[trackingLogs.length - 1] : null;
  }
}

module.exports = new OrderLogService();
