// Verify Firebase User Authentication Token
const admin = require("../config/firebase");
const { getCollection } = require("../config/db");
const { Unauthorized, Forbidden } = require("../core/errors/errors");

const verifyFBToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Unauthorized("Unauthorized Access!");
    }

    const token = authHeader.split(" ")[1];
    const decodedUser = await admin.auth().verifyIdToken(token);

    req.user = decodedUser;
    req.decoded_email = decodedUser.email;

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email: decodedUser.email });

    if (user?.disabled) throw new Forbidden("Account Disabled. Contact Admin!");

    next();
  } catch (error) {
    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/argument-error"
    ) {
      return next(new Unauthorized("Invalid Or Expired Token!"));
    }
    next(error);
  }
};

module.exports = verifyFBToken;
