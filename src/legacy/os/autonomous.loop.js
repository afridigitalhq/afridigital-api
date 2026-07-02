const { economyBrain } = require("../ai/brain.economy");
const { matchUser } = require("../marketplace/matcher.engine");
const { buildLayout } = require("../layout/layout.engine");
const { buildFeed } = require("../feed/feed.engine");
const bus = require('../eventbus');

async function runOSCycle(user, dataset) {

  // =========================
  // 1. AI BRAIN PHASE
  // =========================
  const brainResult = await economyBrain(user.input || "", user.id);

  // =========================
  // 2. MARKETPLACE PHASE
  // =========================
  const market = matchUser(
    user,
    dataset.jobs || [],
    dataset.earn || [],
    dataset.services || []
  );

  // =========================
  // 3. FEED PHASE
  // =========================
  const feed = buildFeed(user);

  // =========================
  // 4. LAYOUT PHASE
  // =========================
  const layout = buildLayout(user, feed);

  // =========================
  // 5. EMIT FULL SYSTEM STATE
  // =========================
  const state = {
    userId: user.id,
    brain: brainResult,
    market,
    feed,
    layout,
    timestamp: Date.now()
  };

  bus.emit("OS_CYCLE_COMPLETE", state);

  return state;
}

module.exports = { runOSCycle };
