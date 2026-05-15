/**
 * 🎁 A3.18.7 DAILY REWARD + COUPON ENGINE
 * Generates engagement incentives
 */

const { publish } = require("../../../event/bus");
const { createEvent } = require("../../../event/types");

const userStreaks = {};

/**
 * Register daily check-in
 */
function registerCheckin(userId) {

  const today = new Date().toDateString();

  if (!userStreaks[userId]) {
    userStreaks[userId] = { streak: 0, lastCheckin: null };
  }

  const data = userStreaks[userId];

  if (data.lastCheckin !== today) {
    data.streak += 1;
    data.lastCheckin = today;
  }

  let reward = null;

  // reward logic
  if (data.streak % 3 === 0) {
    reward = {
      type: "COUPON",
      value: "10% DISCOUNT",
      code: "AFRI-" + Math.random().toString(36).slice(2, 7).toUpperCase()
    };
  }

  const event = createEvent("DAILY_CHECKIN", {
    userId,
    streak: data.streak,
    reward
  });

  publish(event);

  return event;
}

module.exports = { registerCheckin };
