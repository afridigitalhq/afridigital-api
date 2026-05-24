const bus = require("./event.bus");
const fraud = require("../engine/fraud.engine");
const messenger = require("../messenger/whatsapp.client");
const memory = require("./memory.brain.v1");
const brainV3 = require("./decision.router.v2");

bus.subscribe("incoming.message", async (msg) => {
  try {

    // persistent memory recall
    const context = await memory.getContext(msg.from);

    // cognitive routing
    const decision = await brainV3.route(msg, context);

    // fraud analysis
    const result = await fraud.analyze({
      event: msg.text,
      payload: { user: msg.from }
    });

    // memory-aware reply
    let reply = "";

    if (decision.route === "FRAUD") {
      reply = "⚠️ Security verification triggered.";
    }

    else if (decision.route === "SALES") {
      reply = "💰 We found a matching offer for you.";
    }

    else if (decision.route === "SUPPORT") {
      reply = "💬 Support request detected. Assistance incoming.";
    }

    else {
      reply =
        result.action === "ALLOW"
          ? `✔ Received: ${msg.text}`
          : `⚠ Message flagged`;
    }

    // cognitive continuity
    await memory.remember(msg.from, {
      text: msg.text,
      route: decision.route,
      ts: Date.now()
    });

    // delivery
    await messenger.send(msg.from, reply);

    // event log
    bus.emitEvent("message.processed", {
      msg,
      decision,
      result
    });

  } catch (e) {

    console.log("QUEUE ERROR:", e);

  }
});

module.exports = {};
