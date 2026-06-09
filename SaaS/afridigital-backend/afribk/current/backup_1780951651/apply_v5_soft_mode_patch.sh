#!/bin/bash

echo "🧠 APPLYING SOFT MODE v5 SAAS PATCH..."

mkdir -p core/ai/gateway/v5/auth
mkdir -p core/ai/gateway/v5/usage
mkdir -p core/ai/gateway/v5/plugins/whatsapp

# =========================
# 1. API KEY SYSTEM (SOFT MODE)
# =========================
cat > core/ai/gateway/v5/auth/keys.js << 'JS'
const keys = new Map();

function generateKey(id = "user") {
  const key = "ak_" + Math.random().toString(36).substring(2, 12);
  keys.set(key, { id, created: Date.now() });
  return key;
}

function validateKey(key) {
  if (!key) return { valid: true, usageKey: "public" }; // SOFT MODE

  if (keys.has(key)) {
    return { valid: true, usageKey: key };
  }

  // soft fallback instead of rejection
  return { valid: true, usageKey: "public", downgraded: true };
}

module.exports = { generateKey, validateKey };
JS

# =========================
# 2. USAGE STORE (NON-BLOCKING)
# =========================
cat > core/ai/gateway/v5/usage/store.js << 'JS'
const store = new Map();

function track(entry) {
  const key = entry.usageKey || "public";
  const prev = store.get(key) || [];

  prev.push({
    ts: Date.now(),
    provider: entry.provider,
    endpoint: entry.endpoint || "/v1/run"
  });

  store.set(key, prev);
}

function getAll() {
  return Object.fromEntries(store);
}

module.exports = { track, getAll };
JS

# =========================
# 3. KERNEL (SOFT MODE AWARE)
# =========================
cat > core/ai/gateway/v5/kernel.js << 'JS'
const { selectProvider } = require("./registry");
const { normalizeProvider } = require("./adapter");
const usage = require("./usage/store");
const { validateKey } = require("./auth/keys");

async function run(req) {
  const auth = validateKey(req.apiKey);

  const provider = normalizeProvider(selectProvider(req));
  const result = await provider.generate(req.text || "");

  const response = {
    text: result?.text || result || "[EMPTY]",
    provider: provider.name || "mock",
    usageKey: auth.usageKey
  };

  // non-blocking usage tracking
  usage.track({
    usageKey: auth.usageKey,
    provider: response.provider,
    endpoint: "/v1/run"
  });

  return response;
}

module.exports = { run };
JS

# =========================
# 4. WHATSAPP STREAM ENGINE (A)
# =========================
cat > core/ai/gateway/v5/plugins/whatsapp/stream.js << 'JS'
const { run } = require("../../kernel");

// simulate chunked streaming
async function streamMessage(text, sendFn) {
  const result = await run({
    text,
    apiKey: "whatsapp"
  });

  const words = result.text.split(" ");
  let buffer = "";

  for (const word of words) {
    buffer += word + " ";

    // simulate typing delay
    await new Promise(r => setTimeout(r, 150));

    await sendFn({
      type: "chunk",
      text: buffer.trim()
    });
  }

  await sendFn({
    type: "final",
    text: result.text
  });

  return result;
}

module.exports = { streamMessage };
JS

# =========================
# 5. REGISTRY (MOCK DEFAULT)
# =========================
cat > core/ai/gateway/v5/registry.js << 'JS'
function selectProvider() {
  return {
    name: "mock",
    generate: async (input) => `[MOCK]${input}`
  };
}

module.exports = { selectProvider };
JS

# =========================
# 6. ADAPTER (STABLE)
# =========================
cat > core/ai/gateway/v5/adapter.js << 'JS'
function normalizeProvider(provider) {
  if (!provider) throw new Error("Missing provider");

  if (provider.generate) return provider;

  if (provider.run) {
    provider.generate = async (input) => provider.run(input);
    delete provider.run;
  }

  return provider;
}

module.exports = { normalizeProvider };
JS

# =========================
# 7. SERVER (RENDER SAFE + WHATSAPP HOOK)
# =========================
cat > server.js << 'JS'
const express = require("express");
const app = express();

app.use(express.json());

const kernel = require("./core/ai/gateway/v5/kernel");
const usage = require("./core/ai/gateway/v5/usage/store");
const { streamMessage } = require("./core/ai/gateway/v5/plugins/whatsapp/stream");

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afri-ai-v5-soft",
    mode: "SOFT_MODE_STREAMING"
  });
});

// ================= AI ENDPOINT =================
app.post("/v1/run", async (req, res) => {
  try {
    const result = await kernel.run(req.body || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= USAGE =================
app.get("/v1/usage", (req, res) => {
  res.json(usage.getAll());
});

// ================= WHATSAPP WEBHOOK =================
app.post("/webhook/whatsapp", async (req, res) => {
  const msg = req.body?.text || "";

  await streamMessage(msg, async (packet) => {
    console.log("WHATSAPP STREAM:", packet);
  });

  res.json({ ok: true });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SOFT MODE v5 RUNNING ON", PORT);
});
JS

echo "🧠 SOFT MODE v5 PATCH COMPLETE"
