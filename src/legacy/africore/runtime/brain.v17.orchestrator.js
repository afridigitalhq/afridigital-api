const forecast = require("./brain.v16.revenue.forecast");
const churn = require("./brain.v16.churn.predictor");
const pricing = require("./brain.v16.pricing.engine");
const negotiation = require("./brain.v15.negotiation.engine");
const bus = require("./event.bus");

/**
 * Central business decision engine
const audit = require("../runtime/brain.v17.audit"); audit.logBusinessEvent(payload);
 */
async function processBusinessMessage(msg) {

  const intent = msg.text || "";

  const revenueScore = forecast.predictRevenue([intent]);
  const churnScore = churn.predictChurn([{ message: intent, ts: Date.now() }]);
  const decision = negotiation.negotiate({ text: intent });

  const price = pricing.computePrice(100, revenueScore, churnScore);

  bus.emitEvent("business.decision", {
const audit = require("../runtime/brain.v17.audit"); audit.logBusinessEvent(payload);
    from: msg.from,
    intent,
    revenueScore,
    churnScore,
    price,
    topAgent: decision.winner.agent
  });

  return {
    reply:
      revenueScore > 0.7
        ? `💰 Premium offer ready: $${price.toFixed(2)}`
        : `✔ We received your request.`
  };
}

module.exports = { processBusinessMessage };
