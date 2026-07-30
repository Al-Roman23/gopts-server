const { getCollection } = require("../../config/db");

const getOrderByTrackingId = async (trackingId) => {
  const orders = await getCollection("orders");
  return orders.findOne({ trackingId });
};

const updatePaymentByTrackingId = async (trackingId, transactionId) => {
  const orders = await getCollection("orders");

  return orders.updateOne(
    { trackingId, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        transactionId,
        paidAt: new Date(),
      },
      $push: {
        trackingLogs: {
          type: "PAYMENT",
          status: "PAID",
          message: "Payment completed successfully!",
          by: { role: "user" },
          transactionId,
          createdAt: new Date(),
        },
      },
    },
  );
};

module.exports = { getOrderByTrackingId, updatePaymentByTrackingId };
