const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7.1 - Coupon Verification Engine
 */

const activeCoupons = {
  FRIDAY10: { discount: 10, expires: "FRIDAY", type: "EVENT" },
  BOOST15: { discount: 15, expires: "NONE", type: "TELEGRAM" }
};

function validateCoupon(code, currentEvent = "NONE") {

  const coupon = activeCoupons[code];

  if (!coupon) {
    return { valid: false, message: "❌ Invalid coupon code" };
  }

  if (coupon.expires !== "NONE" && coupon.expires !== currentEvent) {
    return { valid: false, message: "⛔ Coupon expired or not valid today" };
  }

  return {
    valid: true,
    discount: coupon.discount,
    type: coupon.type
  };
}

module.exports = {
  validateCoupon
};
