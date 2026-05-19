const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require('crypto');
const fs = require('fs');
const wallet = require('./afrios.wallet');

const DB = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB));
}

function save(db) {
  fs.writeFileSync(DB, JSON.stringify(db, null, 2));
}

// generate click link
function generateAdClickLink(ad, userId) {
  const clickId = crypto.randomUUID();

  const db = load();

  db.events.push({
    event: "AD_CLICK_CREATED",
    data: { clickId, adId: ad.id, userId },
    time: new Date().toISOString()
  });

  save(db);

  return `https://afridigital-api.onrender.com/ad/click/${clickId}?user=${userId}&ad=${ad.id}`;
}

// resolve click + PAY USER
function resolveClick(clickId, userId, adId) {

  const db = load();

  db.events.push({
    event: "AD_CLICKED",
    data: { clickId, userId, adId },
    time: new Date().toISOString()
  });

  save(db);

  // 💰 REAL EARNING
  wallet.credit(userId, 10, `ad_click:${adId}`);

  return { success: true };
}

module.exports = {
  generateAdClickLink,
  resolveClick
};
