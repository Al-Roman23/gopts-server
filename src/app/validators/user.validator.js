function validateRegisterUser(data) {
  const { uid, name, email, role, status } = data;

  if (!uid?.trim() || !name?.trim() || !email?.trim() || !role?.trim()) {
    return {
      valid: false,
      message: "UID, Name, Email, and Role are required!",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format!" };
  }

  const allowedRoles = ["buyer", "manager"];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return { valid: false, message: "Role must be 'buyer' or 'manager'!" };
  }

  if (
    status &&
    !["pending", "active", "suspended"].includes(status.toLowerCase())
  ) {
    return {
      valid: false,
      message: "Status must be 'pending', 'active', or 'suspended'!",
    };
  }

  return { valid: true };
}

function validateUpdateRole(role) {
  if (!role?.trim()) {
    return { valid: false, message: "Role is required!" };
  }

  const allowedRoles = ["buyer", "manager"];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return { valid: false, message: "Role must be 'buyer' or 'manager'!" };
  }

  return { valid: true };
}

function validateSuspend(reason, feedback = "") {
  if (!reason?.trim()) {
    return { valid: false, message: "Suspend reason is required!" };
  }

  if (reason.length > 500) {
    return {
      valid: false,
      message: "Suspend reason cannot exceed 500 characters!",
    };
  }

  if (feedback && feedback.length > 500) {
    return {
      valid: false,
      message: "Suspend feedback cannot exceed 500 characters!",
    };
  }

  return { valid: true };
}

module.exports = {
  validateRegisterUser,
  validateUpdateRole,
  validateSuspend,
};
