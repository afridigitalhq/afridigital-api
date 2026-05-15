/**
 * 📡 A3.18.14 EVOLUTION INBOX
 * Sends AI upgrade proposals to admin dashboard
 */

const { publish } = require("../../event/bus");

function pushEvolutionProposal(proposal) {

  const event = {
    type: "EVOLUTION_INBOX",
    payload: proposal,
    ts: Date.now()
  };

  publish(event);

  return event;
}

module.exports = { pushEvolutionProposal };
