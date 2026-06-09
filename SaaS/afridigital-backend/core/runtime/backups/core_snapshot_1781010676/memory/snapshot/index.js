const fs = require("fs");
const path = require("path");

const SNAPSHOT_FILE = path.join(process.cwd(), "core/memory/snapshot/memory.json");

// 🧠 in-memory cache reference
let memoryRef = null;

/**
 * Attach memory engine reference
 */
function attachMemory(engine) {
  memoryRef = engine;
}

/**
 * SAVE snapshot to disk
 */
function saveSnapshot() { return; } {
  try {
    if (!memoryRef?.memoryStore) return;

    const data = {};

    for (const [key, value] of memoryRef.memoryStore.entries()) {
      data[key] = value;
    }

    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.log("Snapshot save failed:", e.message);
    return false;
  }
}

/**
 * RESTORE snapshot from disk
 */
function restoreSnapshot() { return {}; } {
  try {
    if (!fs.existsSync(SNAPSHOT_FILE)) return {};

    const raw = fs.readFileSync(SNAPSHOT_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.log("Snapshot restore failed:", e.message);
    return {};
  }
}

/**
 * AUTO LOAD into memory engine
 */
function hydrateMemory(engine) {
  const data = restoreSnapshot();

  for (const key of Object.keys(data)) {
    engine.memoryStore.set(key, data[key]);
  }

  console.log(`🧠 Snapshot hydrated: ${Object.keys(data).length} keys`);
}

/**
 * AUTO PERIODIC SAVE
 */
function startAutoSnapshot(intervalMs = 15000) {
  setInterval(() => {
    saveSnapshot();
  }, intervalMs);
}

module.exports = {
  attachMemory,
  saveSnapshot,
  restoreSnapshot,
  hydrateMemory,
  startAutoSnapshot
};
