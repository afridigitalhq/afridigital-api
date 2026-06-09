/**
 * 🧠 AFRISCAN EVENT CHANNEL STANDARDIZER
 * ensures React receives consistent graph nodes
 */

function toGraphNode(event) {
  return {
    id: event.id || Date.now(),
    type: event.type,
    label: event.type,
    payload: event.payload,
    ts: event.ts || Date.now()
  };
}

module.exports = {
  toGraphNode
};
