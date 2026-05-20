const crypto = require("crypto");

// simple in-memory cache (fast + zero cost)
const cache = new Map();

function hash(text) {
  return crypto.createHash("md5").update(text).digest("hex");
}

// ⚡ Layer 1: instant rules (no AI cost)
function ruleEngine(text) {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi")) {
    return "Hey 👋 I’m AfriAI. How can I help?";
  }

  if (t.includes("pricing")) {
    return "💳 Pricing info coming soon. Ask me anything else.";
  }

  if (t.includes("help")) {
    return "🛠 Tell me your issue and I’ll assist you.";
  }

  return null;
}

// 🧠 Layer 2: cached responses
function getCache(text) {
  return cache.get(hash(text));
}

function setCache(text, reply) {
  cache.set(hash(text), reply);
}

// 🧠 Main router
async function processMessage({ body, ai }) {
  const text = (body.message || "").trim();

  // 1. RULE ENGINE (fastest)
  const rule = ruleEngine(text);
  if (rule) return { reply: rule };

  // 2. CACHE CHECK
  const cached = getCache(text);
  if (cached) return { reply: cached };

  // 3. AI FALLBACK (OpenAI OR Ollama later)
  let reply;

  try {
    reply = await ai(text);
  } catch (e) {
    reply = "⚡ AI temporarily unavailable.";
  }

  // 4. SAVE CACHE
  setCache(text, reply);

  return { reply };
}

module.exports = { processMessage };
