const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🔗 AfriOS Link Tracking Engine v2.7
 */

const fs = require('fs');

const LINK_DB = './storage/ads/clicks.json';

// 📦 LOAD
function load() {
  try {
    return JSON.parse(fs.readFileSync(LINK_DB));
  } catch {
    return [];
  }
}

// 💾 SAVE
function save(data) {
  fs.writeFileSync(LINK_DB, JSON.stringify(data, null, 2));
}

// 🔗 REGISTER CLICK
function registerClick(adId, user, url) {

  const db = load();

  const click = {
    id: 'clk_' + Date.now(),
    adId,
    user,
    url,
    timestamp: new Date().toISOString(),
    verified: false
  };

  db.push(click);

  save(db);

  return click;
}

// 📊 GET CLICK STATS
function getAdStats(adId) {

  const db = load().filter(c => c.adId === adId);

  return {
    adId,
    totalClicks: db.length,
    uniqueUsers: new Set(db.map(c => c.user)).size
  };
}

// ✅ VERIFY CLICK (future bot protection hook)
function verifyClick(clickId) {

  const db = load();

  const click = db.find(c => c.id === clickId);

  if (!click) return null;

  click.verified = true;

  save(db);

  return click;
}

module.exports = {
  registerClick,
  getAdStats,
  verifyClick
};
