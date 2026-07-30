// Verify Active User Authentication Middleware
const { getCollection } = require("../config/db");
const { Unauthorized, Forbidden, NotFound } = require("../core/errors/errors");

const verifyActive = async (req, res, next) => {
  try {
    if (!req.decoded_email)
      throw new Unauthorized("Unauthorized: No Email Found!");

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email: req.decoded_email });
    if (!user) throw new NotFound("User Not Found!");

    if (user.status === "pending")
      throw new Forbidden("Account not approved yet!");

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyActive;
