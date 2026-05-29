const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'memory.json');

const memory = new Map();

// CONFIG
const MAX_MESSAGES = 8;
const MESSAGE_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const SAVE_INTERVAL_MS = 5000;

// dirty flag (prevents constant disk writes)
let dirty = false;

/**
 * LOAD MEMORY FROM DISK
 */
function loadMemory() {
  try {
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, 'utf-8');
      const data = JSON.parse(raw);

      Object.entries(data).forEach(([key, value]) => {
        memory.set(key, value);
      });

      console.log("🧠 Memory restored from disk");
    }
  } catch (err) {
    console.error("⚠️ Memory load failed:", err.message);
  }
}

/**
 * SAVE MEMORY (throttled)
 */
function saveMemory() {
  if (!dirty) return;

  try {
    const obj = Object.fromEntries(memory.entries());
    fs.writeFileSync(FILE, JSON.stringify(obj, null, 2));

    dirty = false;
  } catch (err) {
    console.error("⚠️ Memory save failed:", err.message);
  }
}

/**
 * CLEAN OLD MESSAGES
 */
function cleanMessages(user) {
  const now = Date.now();

  user.messages = user.messages.filter(m =>
    now - m.timestamp < MESSAGE_TTL_MS
  );

  if (user.messages.length > MAX_MESSAGES) {
    user.messages = user.messages.slice(-MAX_MESSAGES);
  }

  return user;
}

function getUser(userId) {
  if (!memory.has(userId)) {
    memory.set(userId, {
      messages: [],
      lastIntent: null,
      summary: null
    });
  }

  return memory.get(userId);
}

/**
 * ADD MESSAGE + OPTIMIZE
 */
function pushMessage(userId, message) {
  const user = getUser(userId);

  user.messages.push({
    text: message.text,
    timestamp: Date.now()
  });

  cleanMessages(user);

  memory.set(userId, user);

  dirty = true;

  return user;
}

/**
 * UPDATE INTENT
 */
function setIntent(userId, intent) {
  const user = getUser(userId);

  user.lastIntent = intent;

  memory.set(userId, user);

  dirty = true;
}

/**
 * SIMPLE MEMORY SUMMARY (compression)
 */
function generateSummary(user) {
  const texts = user.messages.map(m => m.text).join(" | ");

  if (texts.length === 0) return null;

  // lightweight compression (no AI dependency)
  return texts.slice(0, 120) + (texts.length > 120 ? "..." : "");
}

function optimizeUser(userId) {
  const user = getUser(userId);

  if (user.messages.length >= MAX_MESSAGES) {
    user.summary = generateSummary(user);
    user.messages = user.messages.slice(-4); // compress
    dirty = true;
  }

  memory.set(userId, user);
}

function getContext(userId) {
  const user = getUser(userId);
  optimizeUser(userId);
  return user;
}

/**
 * AUTO PERSIST LOOP (throttled)
 */
setInterval(saveMemory, SAVE_INTERVAL_MS);

loadMemory();

module.exports = {
  getUser,
  pushMessage,
  setIntent,
  getContext
};
