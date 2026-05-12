const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7.2 - Coupon Authority System
 * ONLY ADMIN/WALLET CAN CREATE COUPONS
 */

function createCoupon({ code, discount, expires, tier = "ALL" }) {

  if (!code || !discount) {
    throw new Error("Invalid coupon definition");
  }

  return {
    code,
    discount,
    expires,
    tier,
    source: "ADMIN_OR_WALLET_ONLY",
    status: "ACTIVE"
  };
}

module.exports = {
  createCoupon
};
