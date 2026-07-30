function validateProduct(data) {
  const {
    name,
    price,
    category,
    quantity,
    moq,
    images,
    paymentOption,
    createdBy,
    videoLink,
  } = data;

  if (
    !name ||
    !category ||
    !createdBy ||
    !paymentOption ||
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return {
      valid: false,
      message:
        "Missing required fields: name, category, createdBy, paymentOption, images!",
    };
  }

  if (typeof price !== "number" || price < 0) {
    return { valid: false, message: "Price must be a positive number!" };
  }

  const qty = Number(quantity);
  const min = Number(moq);

  if (isNaN(qty) || isNaN(min)) {
    return { valid: false, message: "Quantity and MOQ must be valid numbers!" };
  }

  if (qty < min) {
    return { valid: false, message: "Quantity cannot be less than MOQ!" };
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

  if (videoLink && typeof videoLink !== "string") {
    return { valid: false, message: "Video link must be a string!" };
  }

  return { valid: true };
}

module.exports = { validateProduct };
