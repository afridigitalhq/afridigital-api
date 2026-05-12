const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7 - Reward Issuer
 */

const { generateUserReward } = require("./afri.reward.engine");

function grantBoostReward(userId, percent = 10) {

  const reward = generateUserReward(userId, percent);

  return {
    message: "🎁 Congrats! You received a boost reward",
    reward
  };
}

module.exports = {
  grantBoostReward
};
