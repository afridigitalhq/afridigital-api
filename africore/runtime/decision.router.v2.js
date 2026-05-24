const telemetry = require("../telemetry/telemetry.layer");
const memory = require("./cluster.memory");
const fraud = require("../engine/fraud.engine");
const predictive = require("./brain.v8.predictive");

const ROUTES = {
  SALES: "SALES",
  SUPPORT: "SUPPORT",
  CAMPAIGN: "CAMPAIGN",
  FRAUD: "FRAUD",
  SWARM: "SWARM"
};

function normalize(v) {
  if (v > 1) return 1;
  if (v < 0) return 0;
  return Number(v || 0);
}

function supportScore(text="") {
  const t = text.toLowerCase();

  let s = 0;

  if (t.includes("help")) s += 0.3;
  if (t.includes("issue")) s += 0.3;
  if (t.includes("problem")) s += 0.3;
  if (t.includes("error")) s += 0.2;
  if (t.includes("not working")) s += 0.3;

  return normalize(s);
}

function salesScore(text="") {
  const t = text.toLowerCase();

  let s = 0;

  if (t.includes("buy")) s += 0.4;
  if (t.includes("premium")) s += 0.3;
  if (t.includes("pricing")) s += 0.2;
  if (t.includes("upgrade")) s += 0.2;
  if (t.includes("pay")) s += 0.2;

  return normalize(s);
}

async function routeMessage(msg) {

  const text = msg.text || "";
  const from = msg.from || "unknown";

  const mem = await memory.getMemory(from).catch(() => ({}));

  const predictiveScore =
    normalize(
      predictive.predictIntent({ text }) || 0
    );

  const support =
    supportScore(text);

  const sales =
    salesScore(text);

  const fraudCheck =
    await fraud.analyze({
      event: text,
      payload: { user: from }
    }).catch(() => ({
      risk: 0,
      action: "ALLOW"
    }));

  const fraudRisk =
    normalize(fraudCheck.risk || 0);

  const memoryWeight =
    mem?.last &&
    String(mem.last).includes("complaint")
      ? 0.25
      : 0;

  const weightedSales =
    normalize(
      (sales * 0.45) +
      (predictiveScore * 0.45) -
      (fraudRisk * 0.2)
    );

  const weightedSupport =
    normalize(
      (support * 0.6) +
      memoryWeight
    );

  let decision = {
    route: ROUTES.SWARM,
    confidence: 0.5,
    explainability: {},
    reason: []
  };

  if (
    fraudCheck.action &&
    fraudCheck.action !== "ALLOW"
  ) {

    decision.route = ROUTES.FRAUD;
    decision.confidence = 0.98;

    decision.reason.push(
      "fraud override"
    );

  } else if (
    weightedSales >= 0.7
  ) {

    decision.route = ROUTES.SALES;
    decision.confidence = weightedSales;

    decision.reason.push(
      "high weighted sales score"
    );

  } else if (
    weightedSupport >= 0.55
  ) {

    decision.route = ROUTES.SUPPORT;
    decision.confidence = weightedSupport;

    decision.reason.push(
      "support confidence threshold reached"
    );

  } else if (
    predictiveScore >= 0.45
  ) {

    decision.route = ROUTES.CAMPAIGN;
    decision.confidence = predictiveScore;

    decision.reason.push(
      "mid predictive intent"
    );

  }

  decision.explainability = {
    predictiveScore,
    support,
    sales,
    fraudRisk,
    memoryWeight,
    weightedSales,
    weightedSupport
  };

  await telemetry.emit(
    "decision.router.v2",
    {
      from,
      text,
      decision
    }
  );

  console.log(
    "🧠 ROUTER V2:",
    JSON.stringify({
      user: from,
      route: decision.route,
      confidence: decision.confidence,
      explainability:
        decision.explainability
    }, null, 2)
  );

  return decision;
}

module.exports = {
  routeMessage,
  ROUTES
};
