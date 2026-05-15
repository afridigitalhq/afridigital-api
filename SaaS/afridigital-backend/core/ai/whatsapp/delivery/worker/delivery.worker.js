/**
 * ⚡ A3.18.13 DELIVERY WORKER (STABLE)
 */

const { setState } = require("../tracker/delivery.tracker");
const { recordMessage } = require("../ledger/message.ledger");

function sendMessage(sendFn, message) {

  const id = message.id || Date.now().toString();

  try {
    setState(id, "SENDING");

    sendFn(message);

    setState(id, "DELIVERED");

    recordMessage({
      id,
      status: "DELIVERED",
      to: message.to,
      ts: Date.now()
    });

  } catch (e) {

    setState(id, "FAILED");

    recordMessage({
      id,
      status: "FAILED",
      to: message.to,
      error: e.message,
      ts: Date.now()
    });

    throw e;
  }
}

module.exports = { sendMessage };
