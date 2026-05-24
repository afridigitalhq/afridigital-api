const swarm = ;
const fraud = require("../engine/fraud.engine");
const messenger = require("../messenger/whatsapp.client");

async function startWorker(id = "agent-1") {

  console.log("🧠 Swarm Agent online:", id);

  await swarm.consume("afri-group", id, async (msg) => {

    const result = await fraud.analyze({
      event: msg.text,
      payload: { user: msg.from }
    });

    const reply =
      result.action === "ALLOW"
        ? `✔ Swarm Reply: ${msg.text}`
        : `⚠ Swarm flagged`;

    await messenger.send(msg.from, reply);
  });
}

module.exports = { startWorker };
