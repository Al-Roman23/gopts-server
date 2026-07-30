const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  getOrderByTrackingId,
  updatePaymentByTrackingId,
} = require("../repositories/payment.repository");
const { BadRequest, NotFound } = require("../../core/errors/errors");

const createCheckoutSession = async (trackingId, user) => {
  const order = await getOrderByTrackingId(trackingId);
  if (!order) throw new NotFound("Order not found");
  if (order.paymentStatus === "paid") throw new BadRequest("Already paid!");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: order.productName },
          unit_amount: order.totalPrice,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/dashboard/my-orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard/my-orders`,
    metadata: { trackingId },
  });

  return { url: session.url };
};

const handlePaymentSuccess = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  const trackingId = session.metadata.trackingId;
  const transactionId = session.payment_intent.id;

  const order = await getOrderByTrackingId(trackingId);
  if (!order) throw new NotFound("Order not found!");

  if (order.paymentStatus === "paid") {
    return {
      message: "Payment already confirmed!",
      transactionId: order.transactionId,
    };
  }

  await updatePaymentByTrackingId(trackingId, transactionId);

  return { message: "Payment confirmed!", transactionId };
};

module.exports = { createCheckoutSession, handlePaymentSuccess };
