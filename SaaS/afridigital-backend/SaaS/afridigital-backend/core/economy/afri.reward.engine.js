const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7 - User Reward Discount Engine
 */

const MAX_USER_DISCOUNT = 10;

function generateUserReward(userId, percent = 10) {

  if (percent > MAX_USER_DISCOUNT) percent = MAX_USER_DISCOUNT;

  return {
    userId,
    discount: percent,
    type: "ONE_TIME_REWARD",
    status: "ACTIVE",
    expiresInHours: 24
  };
}

function applyUserReward(amount, reward) {
  if (!reward || reward.status !== "ACTIVE") return amount;

  return amount - (amount * reward.discount / 100);
}

module.exports = {
  generateUserReward,
  applyUserReward
};
