const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function trackClick(adId) {

  const ads =
    db.read('ads.db.json');

  const ad =
    ads.find(a => a.id === adId);

  if (ad) ad.clicks += 1;

  db.write('ads.db.json', ads);
}

function trackImpression(adId) {

  const ads =
    db.read('ads.db.json');

  const ad =
    ads.find(a => a.id === adId);

  if (ad) ad.impressions += 1;

  db.write('ads.db.json', ads);
}

module.exports = {
  trackClick,
  trackImpression
};
