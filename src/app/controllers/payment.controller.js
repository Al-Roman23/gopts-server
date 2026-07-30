const {
  createCheckoutSession,
  handlePaymentSuccess,
} = require("../services/payment.service");

const createSession = async (req, res, next) => {
  try {
    const result = await createCheckoutSession(
      req.body.trackingId,
      req.currentUser,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const paymentSuccess = async (req, res, next) => {
  try {
    const result = await handlePaymentSuccess(req.query.session_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { createSession, paymentSuccess };
