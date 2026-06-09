const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LOG_DIR = path.join(process.cwd(), "core/events/logs");
const LOG_FILE = path.join(LOG_DIR, "event-log.jsonl");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// in-memory dedup index
const seen = new Set();

function hashEvent(event) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex");
}

function append(event) {
  const enriched = {
    id: event.id || "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2),
    ts: Date.now(),
    type: event.type,
    traceId: event.traceId || null,
    parent: event.parent || null,
    node: process.env.NODE_ID || "local"
  };

  enriched.hash = hashEvent(enriched);

  // 🔥 DEDUP RULE
  if (seen.has(enriched.hash)) return enriched;
  seen.add(enriched.hash);

  fs.appendFileSync(LOG_FILE, JSON.stringify(enriched) + "\n");

  return enriched;
}

function readAll() {
  if (!fs.existsSync(LOG_FILE)) return [];

  const raw = fs.readFileSync(LOG_FILE, "utf8").trim();
  if (!raw) return [];

  return raw.split("\n")
    .map(l => {
      try { return JSON.parse(l); } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => {
      // deterministic ordering rule
      if (a.traceId !== b.traceId)
        return (a.traceId || "").localeCompare(b.traceId || "");

      if (a.parent !== b.parent)
        return (a.parent || "").localeCompare(b.parent || "");

      if (a.node !== b.node)
        return a.node.localeCompare(b.node);

      return a.ts - b.ts;
    });
}

module.exports = {
  append,
  readAll,
  hashEvent,
  LOG_FILE
};
