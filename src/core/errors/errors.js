// Define Custom API Error Classes
class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class Unauthorized extends ApiError {
  constructor(message) {
    super(message, 401);
  }
}

class NotFound extends ApiError {
  constructor(message) {
    super(message, 404);
  }
}

class Forbidden extends ApiError {
  constructor(message) {
    super(message, 403);
  }
}

class Conflict extends ApiError {
  constructor(message) {
    super(message, 409);
  }
}

class BadRequest extends ApiError {
  constructor(message) {
    super(message, 400);
  }
}

class InternalError extends ApiError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = {
  ApiError,
  Unauthorized,
  NotFound,
  Forbidden,
  Conflict,
  BadRequest,
  InternalError,
};
