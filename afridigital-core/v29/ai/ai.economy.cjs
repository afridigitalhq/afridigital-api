const wallet = require("../wallet/wallet.service.cjs");

function rewardUser(userId, reason) {
  wallet.credit(userId, 0.5);

  console.log("💰 USER REWARDED:", {
    userId,
    reason
  });
}

function injectAd() {
  return {
    type: "sponsored",
    title: "Earn online with AfriDigital",
    reward: 0.2
  };
}

module.exports = {
  rewardUser,
  injectAd
};
