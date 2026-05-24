const Redis = require("redis");
const telemetry = require("../telemetry/telemetry.layer");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const fraudEngine = require("../engine/fraud.engine");
const predictive = require("./brain.v8.predictive");
const memory = require("./cluster.memory");

const ROUTES = {
  FRAUD: "FRAUD",
  SALES: "SALES",
  SUPPORT: "SUPPORT",
  CAMPAIGN: "CAMPAIGN",
  SWARM_ONLY: "SWARM_ONLY"
};

function containsSupport(text) {
  const t = text.toLowerCase();
  return t.includes("help") || t.includes("issue") || t.includes("problem");
}

async function routeMessage(msg) {
  const text = msg.text || "";
  const from = msg.from;

  const intent = predictive.predictIntent({ text });

  const fraud = await fraudEngine.analyze({
    event: text,
    payload: { user: from }
  });

  const mem = await memory.getMemory(from);

  let decision = {
    route: ROUTES.SWARM_ONLY,
    confidence: 0.5,
    reason: []
  };

  // 1. FRAUD OVERRIDE
  if (fraud.action !== "ALLOW") {
    decision.route = ROUTES.FRAUD;
    decision.confidence = 0.95;
    decision.reason.push("Fraud engine flagged message");
  }

  // 2. SALES INTENT
  else if (intent > 0.8) {
    decision.route = ROUTES.SALES;
    decision.confidence = intent;
    decision.reason.push("High purchase intent detected");
  }

  // 3. SUPPORT
  else if (containsSupport(text)) {
    decision.route = ROUTES.SUPPORT;
    decision.confidence = 0.7;
    decision.reason.push("Support-related keywords detected");
  }

  // 4. MEMORY BOOST
  if (mem?.last && mem.last.includes("complaint")) {
    decision.route = ROUTES.SUPPORT;
    decision.reason.push("Memory indicates unresolved issue");
  }

  // 5. DEFAULT CAMPAIGN CHECK
  else if (intent > 0.5) {
    decision.route = ROUTES.CAMPAIGN;
    decision.reason.push("Mid-intent routed to campaign engine");
  }

  await logDecision(from, text, decision);
await telemetry.emit("decision.route", { user: from, route: decision.route, confidence: decision.confidence, reason: decision.reason });

  return decision;
}

async function logDecision(user, text, decision) {
  await client.xAdd("afri:router:log", "*", {
    user,
    text,
    route: decision.route,
    confidence: decision.confidence.toString(),
    reason: JSON.stringify(decision.reason)
  });
}

module.exports = { routeMessage, ROUTES };
