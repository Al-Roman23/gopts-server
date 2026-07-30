// Generate Unique Sequential Tracking ID
const { getCollection } = require("../config/db");

const generateTrackingId = async () => {
  const paymentsCollection = await getCollection("payments");
  const ordersCollection = await getCollection("orders");

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}${String(now.getDate()).padStart(2, "0")}`;

  let sequence = 1;

  while (sequence < 1000) {
    const trackingId = `GOPTS-${dateStr}-${String(sequence).padStart(3, "0")}`;
    const exists =
      (await paymentsCollection.findOne({ trackingId })) ||
      (await ordersCollection.findOne({ trackingId }));

    if (!exists) return trackingId;

    sequence += 1;
  }

  throw new Error("Unable to generate unique tracking ID!");
};

module.exports = generateTrackingId;
