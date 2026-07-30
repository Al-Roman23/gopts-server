// Handle Errors In Express Middleware
const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error({ err }, "Unhandled Error Caught By Middleware!");
  
  const status = err.status || 500;
  const message = err.message || "Internal Server Error!";
  
  res.status(status).json({ success: false, error: message });
}

module.exports = { errorHandler };
