const fraudEngine = require("../engine/fraud.engine");
const telemetry = require("../telemetry/telemetry.layer");
const messenger = require("../messenger/whatsapp.client");

const bus = require("../runtime/event.bus");
const guard = require("../runtime/live.guard");
const live = require("../runtime/live.intelligence.mode");

const predictive = require("../runtime/brain.v8.predictive");
const revenueLoop = require("../runtime/brain.v6.sales.loop");
const segmenter = require("../runtime/brain.v9.segmenter");

const valueBrain = require("../runtime/user.value.brain");
const africoin = require("../runtime/africoin.engine");

const memoryBrain = require("../runtime/memory.brain.v1");
const brainV3 = require("../runtime/decision.router.v2");

async function webhookHandler(req, res) {

  try {

    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    // duplicate protection
    if (await guard.isProcessed(message.id || Date.now().toString())) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message?.text?.body || "hello";
await telemetry.emit("incoming.message", { from, text });
telemetry.track("incoming.message", { from, text });

    // live intelligence
    const routing = await live.handle({ from, text });

    // memory recall
    const mem = await memoryBrain.getMemory(from);

    // predictive intent
    const intentScore = predictive.predictIntent({ text });

    // value brain
    await valueBrain.updateUserValue(from, intentScore);

    // africoin rewards
    await africoin.processEarn(from, "engagement");

    if (intentScore > 0.8) {
      await africoin.processEarn(from, "high_intent");
    }

    // campaign segmentation
    await segmenter.segmentUser({ from, text }, intentScore);

    // revenue automation
    await revenueLoop.handleMessage({ from, text });

    // cognitive routing
    const decision = await brainV3.route({
      from,
      text,
      memory: mem
    });

    // fraud engine
    const fraud = await fraudEngine.analyze({
      event: text,
      payload: { user: from }
    });

    let reply = "";

    if (decision.route === "FRAUD") {

      reply = "⚠️ Security verification triggered.";

    } else if (decision.route === "SALES") {

      reply = "💰 We found a matching offer for you.";

    } else if (decision.route === "SUPPORT") {

      reply = "💬 Support request detected.";

    } else {

      reply =
        fraud.action === "ALLOW"
          ? `✔ Received: ${text}`
          : `⚠ Message flagged`;
    }

    // cognitive continuity
    await memoryBrain.remember(from, {
      text,
      route: decision.route,
      ts: Date.now()
    });

    // async swarm pipeline
    bus.emitEvent("incoming.message", {
      from,
      text,
      routing
    });

    // whatsapp send
    await messenger.send(from, reply);

    console.log("🧠 LIVE MESSAGE:", {
      from,
      route: decision.route,
      intentScore
    });

    return res.sendStatus(200);

  } catch (e) {

    console.log("GATEWAY ERROR:", e);
    return res.sendStatus(200);

  }
}

module.exports = webhookHandler;
