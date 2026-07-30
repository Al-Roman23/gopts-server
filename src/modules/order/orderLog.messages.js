// Predefined Order Process Log Messages
const OrderLogMessages = {
  orderCreated: (order) =>
    `Order placed for "${order.productName}" (${order.quantity} pcs).`,
  paymentInitiated: () => `Online payment initiated.`,
  paymentCompleted: (txnId) =>
    `Payment completed successfully. Transaction ID: ${txnId}.`,
  orderApproved: (managerEmail) =>
    `Order approved by manager (${managerEmail}).`,
  orderRejected: (managerEmail, reason) =>
    `Order rejected by manager (${managerEmail}). Reason: ${reason}.`,
  cuttingCompleted: () => `Cutting process completed.`,
  sewingStarted: () => `Sewing process started.`,
  finishing: () => `Finishing process in progress.`,
  qcChecked: () => `Quality check completed.`,
  packed: () => `Order packed and ready for shipment.`,
  shipped: () => `Order shipped.`,
  outForDelivery: () => `Out for delivery.`,
  delivered: () => `Order delivered successfully.`,
};

module.exports = OrderLogMessages;
