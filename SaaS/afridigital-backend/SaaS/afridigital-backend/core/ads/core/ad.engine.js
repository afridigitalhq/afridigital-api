const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function createAd(ad) {

  const ads =
    db.read('ads.db.json');

  ads.push({
    ...ad,
    id: Date.now(),
    impressions: 0,
    clicks: 0,
    timestamp: Date.now()
  });

  db.write('ads.db.json', ads);

  return ad;
}

module.exports = { createAd };
