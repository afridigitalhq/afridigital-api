const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');
const { referralReward } = require('../earnings/earnings.engine');

function registerReferral(referrer, newUser) {

  const referrals =
    db.read('referrals.db.json');

  referrals.push({
    referrer,
    newUser,
    timestamp: Date.now()
  });

  db.write('referrals.db.json', referrals);

  referralReward(referrer, 100);

  return true;
}

module.exports = { registerReferral };
