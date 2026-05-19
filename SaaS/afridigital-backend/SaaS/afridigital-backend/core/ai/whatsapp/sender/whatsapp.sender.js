/**
 * 📡 A3.18.5 WHATSAPP SENDER BRIDGE (CONTROLLED MODE)
 * ONLY sends messages after explicit approval
 */

const { publish } = require("../../../event/bus");
const { createEvent } = require("../../../event/types");

/**
 * SEND QUEUE (no auto-send execution)
 */
const sendQueue = [];

/**
 * Queue message instead of sending instantly
 */
function queueMessage(message) {

  const event = createEvent("WHATSAPP_OUTBOUND_QUEUED", {
    to: message.to,
    body: message.message,
    status: "PENDING_APPROVAL"
  });

  sendQueue.push(event);
  publish(event);

  return event;
}

/**
 * ADMIN APPROVED SENDER (SAFE GATE)
 */
function approveAndSend(index) {

  const item = sendQueue[index];
  if (!item) {
    return { status: "NOT_FOUND" };
  }

  const sentEvent = createEvent("WHATSAPP_OUTBOUND_SENT", {
// C4: outbound marked processed - no re-entry allowed
    to: item.payload.to,
    body: item.payload.body,
    status: "SENT",
    ts: Date.now()
  });

  publish(sentEvent);

  // remove from queue
  sendQueue.splice(index, 1);

  return sentEvent;
}

/**
 * VIEW QUEUE
 */
function getQueue() {
  return sendQueue;
}

module.exports = {
  queueMessage,
  approveAndSend,
  getQueue
};
