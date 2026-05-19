const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');
const { renderCard } = require('../core/card.renderer');

function loadAds() {
  const data = fs.readFileSync('./storage/ads/ads.database.json');
  return JSON.parse(data);
}

function getActiveAds() {
  return loadAds().filter(a => a.active);
}

function getRandomAd() {
  const ads = getActiveAds();
  return ads[Math.floor(Math.random() * ads.length)];
}

/**
 * 📦 CARD FORMAT OUTPUT (STANDARDIZED)
 */
function buildAdCard(ad) {
  const card = {
    title: ad.title,
    description: ad.description,
    cta: ad.cta,
    url: ad.url,
    reward: ad.reward
  };

  return renderCard(card);
}

module.exports = {
  loadAds,
  getActiveAds,
  getRandomAd,
  buildAdCard
};
