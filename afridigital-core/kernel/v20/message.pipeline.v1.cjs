const { tenantDispatch } = require("./tenant.dispatcher.cjs");
const { getTenantMemory } = require("./tenant.memory.cjs");
const { isDuplicate } = require("./message.dedup.cjs");
const { revenueScore, classifyCustomer } = require("./revenue.intelligence.cjs");
const { generateOffer } = require("./offer.engine.cjs");
const { routeConversion } = require("./conversion.router.cjs");

async function processMessage(redis, message) {
  const tenantId = message.tenantId || "default";

  // 1. Dedup layer (HARD STOP)
  const dedupId = `${message.user}:${message.text}`;
  if (await isDuplicate(redis, dedupId)) {
    console.log("🟡 DUP BLOCK:", dedupId);
    return null;
  }

  // 2. Load memory
  const memory = await getTenantMemory(redis, tenantId, message.user);

  // 3. AI decision
  const decision = await tenantDispatch(redis, tenantId, message);
              const { runSwarmV3 } = require("./agent.swarm.v2.cjs");
              const swarmDecision = await runSwarmV3(this.redis, data);
              data.swarm = swarmDecision;

  // 4. Revenue intelligence
  const score = revenueScore(message, memory);
  const customerType = classifyCustomer(score);

  // 5. Conversion routing
  const conversion = routeConversion(score, message);

  // 6. Offer generation
  const offer = generateOffer(customerType);

  // 7. Enrichment output
  return {
    ...message,
    tenantId,
    memory,
    decision,
    revenueScore: score,
    customerType,
    conversion,
    offer
  };
}

module.exports = { processMessage };
