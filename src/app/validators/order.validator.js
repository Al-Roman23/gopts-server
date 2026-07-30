const { ObjectId } = require("mongodb");

function validateOrder(data, product) {
  const {
    userName,
    userEmail,
    productName,
    productId,
    quantity,
    paymentOption,
    status,
    deliveryAddress,
    contactNumber,
  } = data;

  if (
    !userName?.trim() ||
    !userEmail?.trim() ||
    !productName?.trim() ||
    !productId?.trim() ||
    !quantity ||
    !status?.trim() ||
    !paymentOption?.trim() ||
    !deliveryAddress?.trim() ||
    !contactNumber?.trim()
  ) {
    return {
      valid: false,
      message:
        "All fields (userName, userEmail, productName, productId, quantity, paymentOption, status, contactNumber, deliveryAddress) are required!",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return { valid: false, message: "Invalid email address!" };
  }

  if (!ObjectId.isValid(productId)) {
    return { valid: false, message: "Invalid product ID!" };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, message: "Quantity must be a positive integer!" };
  }

  if (product) {
    if (quantity > product.quantity) {
      return {
        valid: false,
        message: `Quantity cannot exceed available stock (${product.quantity})!`,
      };
    }

    if (quantity < product.moq) {
      return {
        valid: false,
        message: `Quantity cannot be less than minimum order quantity (${product.moq})!`,
      };
    }
  }

  const allowedPaymentOptions = ["COD", "PayFirst"];
  if (!allowedPaymentOptions.includes(paymentOption)) {
    return {
      valid: false,
      message: `Payment option must be one of: ${allowedPaymentOptions.join(
        ", ",
      )}`,
    };
  }

  const allowedStatus = ["pending", "approved", "rejected"];
  if (!allowedStatus.includes(status.toLowerCase())) {
    return {
      valid: false,
      message: "Status must be 'Pending', 'Approved', or 'Rejected'!",
    };
  }

  if (!/^\+?\d{7,15}$/.test(contactNumber)) {
    return { valid: false, message: "Invalid contact number format!" };
  }

  return { valid: true };
}

function validateTrackingLog(data) {
  const { location, note, status } = data;

  if (!location?.trim() || !status?.trim()) {
    return { valid: false, message: "Location and status are required!" };
  }

  const allowedTrackingStatus = [
    "Cutting Completed!",
    "Sewing Started!",
    "Finishing!",
    "QC Checked!",
    "Packed!",
    "Shipped!",
    "Out For Delivery!",
    "Delivered!",
  ];
  if (!allowedTrackingStatus) {
    return {
      valid: false,
      message: `Status must be one of: ${allowedTrackingStatus.join(", ")}`,
    };
  }

  if (note && note.length > 500) {
    return { valid: false, message: "Note cannot exceed 500 characters!" };
  }

  return { valid: true };
}

module.exports = { validateOrder, validateTrackingLog };
