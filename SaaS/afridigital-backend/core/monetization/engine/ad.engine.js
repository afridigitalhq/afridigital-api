const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function recordAdView(user, ad) {

  const ads =
    db.read('ads.db.json');

  ads.push({
    user,
    ad,
    type: ad.type || 'external',
    timestamp: Date.now(),
    event: 'view'
  });

  db.write('ads.db.json', ads);

  return {
    message: 'Ad view recorded',
    reward: 1
  };
}

function recordAdClick(user, ad) {

  const ads =
    db.read('ads.db.json');

  ads.push({
    user,
    ad,
    type: ad.type || 'external',
    timestamp: Date.now(),
    event: 'click'
  });

  db.write('ads.db.json', ads);

  return {
    message: 'Ad click recorded',
    reward: 5
  };
}

module.exports = {
  recordAdView,
  recordAdClick
};
