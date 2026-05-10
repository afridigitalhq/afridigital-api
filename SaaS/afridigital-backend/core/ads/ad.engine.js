const { adReward } = require('../earnings/earnings.engine');

function trackAdView(phone) {

  adReward(phone, 5);

  return {
    success: true,
    message: 'Ad view rewarded'
  };
}

module.exports = { trackAdView };
