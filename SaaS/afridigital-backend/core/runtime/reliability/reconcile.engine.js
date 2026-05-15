/**
 * 🔁 A3.18.22 RECONCILIATION ENGINE
 */

const { getStatus } = require("../ack/delivery.ack.engine");

function reconcile(pendingMessages, resendFn) {

  const now = Date.now();

  for (const msg of pendingMessages) {

    const status = getStatus(msg.id);

    // stuck message detection
    if (status.status === "SENT" && now - status.ts > 15000) {
      resendFn(msg);
    }

    // dead letter
    if (status.status === "SENT" && now - status.ts > 60000) {
      msg.dead = true;
    }
  }
}

module.exports = { reconcile };
