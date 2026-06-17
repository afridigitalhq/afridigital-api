#!/bin/bash

echo "🧠 APPLYING STRICT KERNEL v5 PATCH..."

mkdir -p core/ai/gateway/v5
mkdir -p core/ai/gateway/v5/plugins
mkdir -p core/ai/gateway/v5/usage

# =========================
# 1. KERNEL CORE
# =========================
cat > core/ai/gateway/v5/kernel.js << 'JS'
const { selectProvider } = require("./registry");
const { normalizeProvider } = require("./adapter");
const usage = require("./usage/store");

async function run(req) {
  const provider = normalizeProvider(selectProvider(req));

  let output = await provider.generate(req.text || "");

  const response = {
    text: output?.text || output || "[EMPTY]",
    provider: provider.name || "mock",
    usageKey: req.apiKey || "public"
  };

  usage.track(req.apiKey || "public", response);

  return response;
}

module.exports = { run };
JS

# =========================
# 2. PROVIDER ADAPTER
# =========================
cat > core/ai/gateway/v5/adapter.js << 'JS'
function normalizeProvider(provider) {
  if (!provider) throw new Error("Missing provider");

  // unify legacy run -> generate
  if (provider.generate) return provider;

  if (provider.run) {
    provider.generate = async (input) => provider.run(input);
    delete provider.run;
  }

  if (!provider.generate) {
    throw new Error("Invalid provider contract (no generate)");
  }

  return provider;
}

module.exports = { normalizeProvider };
JS

# =========================
# 3. USAGE STORE (BILLING READY)
# =========================
cat > core/ai/gateway/v5/usage/store.js << 'JS'
const store = new Map();

function track(key, payload) {
  const prev = store.get(key) || [];
  prev.push({
    ts: Date.now(),
    provider: payload.provider,
    usageKey: payload.usageKey
  });
  store.set(key, prev);
}

function getAll() {
  return Object.fromEntries(store);
}

module.exports = { track, getAll };
JS

# =========================
# 4. REGISTRY (SIMPLE MOCK FIRST)
# =========================
cat > core/ai/gateway/v5/registry.js << 'JS'
function selectProvider(req) {
  return {
    name: "mock",
    generate: async (input) => {
      return `[MOCK]${input}`;
    }
  };
}

module.exports = { selectProvider };
JS

# =========================
# 5. WHATSAPP PLUGIN (SAFE OPTIONAL)
# =========================
cat > core/ai/gateway/v5/plugins/whatsapp.js << 'JS'
const { run } = require("../kernel");

async function handleMessage(msg) {
  const result = await run({
    apiKey: "whatsapp",
    text: msg.text
  });

  return result.text;
}

module.exports = { handleMessage };
JS

# =========================
# 6. SERVER REWRITE (RENDER SAFE)
# =========================
cat > server.js << 'JS'
const express = require("express");
const app = express();

const { run } = require("./core/ai/gateway/v5/kernel");
const usage = require("./core/ai/gateway/v5/usage/store");

app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afri-ai-v5-kernel",
    mode: "STRICT_KERNEL"
  });
});

// UNIFIED AI ENDPOINT
app.post("/v1/run", async (req, res) => {
  try {
    const result = await run(req.body || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: "KERNEL_FAILURE",
      message: e.message
    });
  }
});

// USAGE (BILLING READY)
app.get("/v1/usage", (req, res) => {
  res.json(usage.getAll());
});

// START
const PORT = process.env.PORT || 3000;
// app.listen DISABLED(PORT, "0.0.0.0", () => {
  console.log("🚀 STRICT KERNEL v5 RUNNING ON", PORT);
});
JS

echo "🧠 V5 STRICT KERNEL PATCH COMPLETE"
