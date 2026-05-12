const { assertApiVersion } = require("../runtime/safety/api.guard");
const wallet = require('../economy/wallet.engine');

function referralReward(phone, amount) {
  return wallet.credit(phone, amount, 'REFERRAL_REWARD');
}

function adReward(phone, amount) {
  return wallet.credit(phone, amount, 'AD_REWARD');
}

function raffleReward(phone, amount) {
  return wallet.credit(phone, amount, 'RAFFLE_WIN');
}

function engagementReward(phone, amount) {
  return wallet.credit(phone, amount, 'ENGAGEMENT');
}

module.exports = {
  referralReward,
  adReward,
  raffleReward,
  engagementReward
};
