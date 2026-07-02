const fraud = require("./brain.v6.revenue");
const campaign = require("./campaign.engine");

function route(msg) {

  const text = msg.text.toLowerCase();

  if (text.includes("complain") || text.includes("error")) {
    return "support";
  }

  if (text.includes("buy") || text.includes("price")) {
    return "sales";
  }

  if (text.includes("hack") || text.includes("fraud")) {
    return "security";
  }

  return "general";
}

async function execute(msg) {
  const decision = route(msg);

  return { decision };
}

module.exports = { route, execute };
