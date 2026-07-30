// Verify Active Or Suspended User Middleware
const { getCollection } = require("../config/db");
const { Unauthorized, NotFound } = require("../core/errors/errors");

const verifyActiveOrSuspended = async (req, res, next) => {
  try {
    if (!req.decoded_email)
      throw new Unauthorized("Unauthorized: No Email Found!");

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email: req.decoded_email });
    if (!user) throw new NotFound("User Not Found!");

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyActiveOrSuspended;
