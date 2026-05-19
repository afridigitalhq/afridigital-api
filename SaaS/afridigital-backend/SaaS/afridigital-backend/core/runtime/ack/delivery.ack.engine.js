/**
 * 📡 A3.18.22 DELIVERY ACK ENGINE
 */

const state = new Map();

function markSent(id) {
  state.set(id, { status: "SENT", ts: Date.now() });
}

function markDelivered(id) {
  const prev = state.get(id) || {};
  state.set(id, { ...prev, status: "DELIVERED", ts: Date.now() });
}

function markAcked(id) {
  const prev = state.get(id) || {};
  state.set(id, { ...prev, status: "ACKED", ts: Date.now() });
}

function getStatus(id) {
  return state.get(id) || { status: "UNKNOWN" };
}

module.exports = {
  markSent,
  markDelivered,
  markAcked,
  getStatus
};
