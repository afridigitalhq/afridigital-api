const bus = require("./event.bus");

function executeRouting(msg, decision) {
  switch (decision.route) {

    case "FRAUD":
      bus.emitEvent("fraud.alert", msg);
      break;

    case "SALES":
      bus.emitEvent("sales.trigger", msg);
      break;

    case "SUPPORT":
      bus.emitEvent("support.ticket", msg);
      break;

    case "CAMPAIGN":
      bus.emitEvent("campaign.entry", msg);
      break;

    default:
      bus.emitEvent("swarm.learn", msg);
  }
}

module.exports = { executeRouting };
