const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V8 - Coupon Authority Registry
 * STRICT SOURCE CONTROL SYSTEM
 */

const allowedSources = [
  "ADMIN_DASHBOARD",
  "WHATSAPP_ADMIN",
  "WALLET_SYSTEM"
];

function createCoupon({ code, discount, expires, source }) {

  if (!allowedSources.includes(source)) {
    throw new Error("❌ Unauthorized coupon source");
  }

  return {
    code,
    discount,
    expires,
    source,
    status: "ACTIVE",
    createdAt: Date.now()
  };
}

function validateCoupon(code, registry = []) {

  const coupon = registry.find(c => c.code === code);

  if (!coupon) {
    return { valid: false, reason: "INVALID" };
  }

  if (coupon.expires !== "NONE" && new Date() > new Date(coupon.expires)) {
    return { valid: false, reason: "EXPIRED" };
  }

  return {
    valid: true,
    discount: coupon.discount
  };
}

module.exports = {
  createCoupon,
  validateCoupon
};
