const swarm = ;
const fraud = require("../engine/fraud.engine");
const messenger = require("../messenger/whatsapp.client");
const { classify, roles } = ;
const adminAgent = require("../engine/admin.agent");

async function startSwarmV2(id = "swarm-v2-main") {

  console.log("🧬 Swarm v2 ONLINE:", id);

  await swarm.consume("afri-group-v2", id, async (msg) => {

    const role = classify(msg);

    let reply = "";

    switch (role) {
      case roles.ADMIN:
        reply = await adminAgent.handleAdmin(msg);
        break;


      case roles.FRAUD:
        const f = await fraud.analyze({
          event: msg.text,
          payload: { user: msg.from }
        });

        reply = f.action === "ALLOW"
          ? "🛡️ Looks safe. Proceed."
          : "⚠️ Suspicious activity detected.";
        break;

      case roles.SALES:
        reply = `💰 Offer detected!\nWe can help you with pricing instantly.`;
        break;

      case roles.SUPPORT:
        reply = `💬 Support team notified.\nWe will assist shortly.`;
        break;

      case roles.ANALYTICS:
      default:
        reply = `📊 Message logged for intelligence training.`;
        break;
    }

    await messenger.send(msg.from, reply);

    await swarm.publish("afri:swarm:v2:result", {
      from: msg.from,
      role,
      text: msg.text
    });
  });
}

module.exports = { startSwarmV2 };
