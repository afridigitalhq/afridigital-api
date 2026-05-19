const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 📊 AfriOS Ad Market Engine v2.9
 * Real-time bidding + ranking system
 */

const fs = require('fs');

const ADS_DB = './storage/ads/ads.database.json';

// 📦 LOAD ADS
function loadAds() {
  try {
    return JSON.parse(fs.readFileSync(ADS_DB));
  } catch {
    return [];
  }
}

// 💰 CALCULATE AD SCORE (ranking engine)
function calculateAdScore(ad) {

  const bid = ad.bid || 0;
  const ctr = ad.ctr || 0; // click-through rate
  const trust = ad.trust || 50;

  // 🧠 ranking formula
  return (bid * 0.6) + (ctr * 30) + (trust * 0.2);
}

// 📊 GET RANKED ADS
function getRankedAds() {

  const ads = loadAds();

  return ads
    .map(ad => ({
      ...ad,
      score: calculateAdScore(ad)
    }))
    .sort((a, b) => b.score - a.score);
}

// 💸 PLACE BID
function placeBid(adId, amount) {

  const ads = loadAds();

  const ad = ads.find(a => a.id === adId);

  if (!ad) return "AD NOT FOUND";

  ad.bid = (ad.bid || 0) + amount;

  fs.writeFileSync(ADS_DB, JSON.stringify(ads, null, 2));

  return {
    status: "BID PLACED",
    adId,
    totalBid: ad.bid
  };
}

module.exports = {
  getRankedAds,
  placeBid,
  calculateAdScore
};
