const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V3.6 - AfriPricing Memory Layer
 * Stores admin-controlled pricing updates safely
 */

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../storage/pricing.memory.json");

// 📦 Load pricing memory
function loadPricing() {
  if (!fs.existsSync(DB_PATH)) {
    return { rates: {}, split: { worker: 0.6, platform: 0.4 } };
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
}

// 💾 Save pricing memory
function savePricing(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 🔁 Update single pricing rule (ADMIN ONLY)
function setPrice(key, value) {
  const db = loadPricing();
  db.rates[key] = Number(value);
  savePricing(db);
  return db;
}

// 🔁 Update split ratio
function setSplit(workerRatio) {
  const db = loadPricing();
  db.split.worker = workerRatio;
  db.split.platform = 1 - workerRatio;
  savePricing(db);
  return db;
}

// 📊 Get live pricing
function getPricing() {
  return loadPricing();
}

// 🧠 Resolve price dynamically
function resolvePrice(action, quantity = 1) {
  const db = loadPricing();
  const rate = db.rates[action] || 0;
  return rate * quantity;
}

module.exports = {
  setPrice,
  setSplit,
  getPricing,
  resolvePrice
};
