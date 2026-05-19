const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');

const CLICK_FILE = './storage/clicks/clicks.db.json';

function loadClicks() {
  if (!fs.existsSync(CLICK_FILE)) return [];
  return JSON.parse(fs.readFileSync(CLICK_FILE));
}

function saveClicks(data) {
  fs.writeFileSync(CLICK_FILE, JSON.stringify(data, null, 2));
}

function trackClick({ user, adId, url }) {
  const clicks = loadClicks();

  clicks.push({
    user,
    adId,
    url,
    time: new Date().toISOString()
  });

  saveClicks(clicks);
}

module.exports = {
  trackClick
};
