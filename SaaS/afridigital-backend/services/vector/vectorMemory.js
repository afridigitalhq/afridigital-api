const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const path = require("path");
const embed = require("./embed");
const cosine = require("./similarity");

const DB_PATH = path.join(__dirname, "vector.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH));
  } catch {
    return {};
  }
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function storeMemory(userId, message, response) {
  const db = load();

  if (!db[userId]) db[userId] = [];

  db[userId].push({
    message,
    response,
    vector: embed(message),
    timestamp: Date.now()
  });

  save(db);
}

function recallMemory(userId, message) {
  const db = load();
  const memories = db[userId] || [];

  const inputVec = embed(message);

  let best = null;
  let bestScore = 0;

  for (const mem of memories) {
    const score = cosine(inputVec, mem.vector);

    if (score > bestScore) {
      bestScore = score;
      best = mem;
    }
  }

  return bestScore > 0.55 ? best : null;
}

module.exports = { storeMemory, recallMemory };
