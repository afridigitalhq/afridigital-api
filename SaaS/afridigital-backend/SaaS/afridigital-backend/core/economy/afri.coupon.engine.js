const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V6 - Coupon Engine
 * Controlled discount system (max 20%)
 */

let globalDiscount = 0; // controlled by admin or AI

const allowedEvents = ["FRIDAY", "XMAS", "EASTER", "RAMADAN"];

function setDiscount(percent, source = "ADMIN") {
  if (percent > 20) percent = 20;
  if (percent < 0) percent = 0;

  globalDiscount = percent;

  return {
    status: "UPDATED",
    discount: globalDiscount,
    source
  };
}

function getDiscount() {
  return globalDiscount;
}

function applyDiscount(amount) {
  return amount - (amount * globalDiscount / 100);
}

module.exports = {
  setDiscount,
  getDiscount,
  applyDiscount
};
