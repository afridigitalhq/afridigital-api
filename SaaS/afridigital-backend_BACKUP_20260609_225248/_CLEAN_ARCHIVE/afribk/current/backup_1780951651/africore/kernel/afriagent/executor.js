const sender = require("./sender.gateway");

async function execute(plan, event) {
  if (!plan) return;

  if (plan.tool === "whatsapp_send") {
    return await sender.send({
      to: plan.payload.to,
      message: plan.payload.message
    });
  }

  console.log("Unknown tool:", plan.tool);
}

module.exports = { execute };
