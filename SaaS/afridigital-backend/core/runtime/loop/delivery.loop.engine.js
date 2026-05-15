/**
 * 🔁 A3.18.23 DELIVERY LOOP ENGINE
 * SELF-HEALING WHATSAPP MESSAGE PIPELINE
 */

const { reconcile } = require("../reliability/reconcile.engine");
const { markSent, markDelivered, markAcked } = require("../ack/delivery.ack.engine");

const pendingMessages = [];

/**
 * ➕ Register outgoing message into loop
 */
function registerMessage(msg) {
  const wrapped = {
    id: msg.id || Date.now().toString(),
    to: msg.to,
    body: msg.message,
    ts: Date.now(),
    retries: 0
  };

  pendingMessages.push(wrapped);
  markSent(wrapped.id);

  return wrapped;
}

/**
 * 📡 Mark delivery success
 */
function confirmDelivered(id) {
  markDelivered(id);
}

/**
 * 📥 Mark user acknowledgment (optional future signal)
 */
function confirmAck(id) {
  markAcked(id);
}

/**
 * 🔁 LOOP TICK (heartbeat reconciliation)
 */
function tick(resendFn) {

  reconcile(pendingMessages, (msg) => {

    if (msg.retries >= 3) return;

    msg.retries += 1;

    resendFn(msg);
  });

  return {
    pending: pendingMessages.length
  };
}

module.exports = {
  registerMessage,
  confirmDelivered,
  confirmAck,
  tick
};
