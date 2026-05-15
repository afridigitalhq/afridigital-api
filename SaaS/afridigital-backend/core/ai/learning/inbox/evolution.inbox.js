/**
 * 📡 A3.18.11 EVOLUTION INBOX STREAM
 * Sends learning insights to dashboard
 */

const { publish } = require("../../../event/bus");

function pushToInbox(insight) {

  const event = {
    type: "EVOLUTION_INSIGHT",
    payload: insight,
    ts: Date.now()
  };

  publish(event);

  return event;
}

module.exports = { pushToInbox };
