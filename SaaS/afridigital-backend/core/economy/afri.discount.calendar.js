const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V6 - Discount Calendar Logic
 */

function getCurrentEvent(date = new Date()) {

  const day = date.getDay(); // 5 = Friday

  if (day === 5) return "FRIDAY";

  return "NONE";
}

function shouldActivateCoupon(event) {
  const activeEvents = ["FRIDAY", "XMAS", "EASTER", "RAMADAN"];
  return activeEvents.includes(event);
}

module.exports = {
  getCurrentEvent,
  shouldActivateCoupon
};
