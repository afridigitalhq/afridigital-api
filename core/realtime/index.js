/**
 * ⚡ Realtime Event Stream Layer
 * Connects AI Brain → Frontend → Admin FlowGraph
 */

const listeners = [];

/**
 * 📡 Subscribe to realtime updates
 */
function subscribe(fn) {
  listeners.push(fn);
}

/**
 * 📤 Broadcast event to all subscribers
 */
function broadcast(event) {
  listeners.forEach(fn => fn(event));
}

/**
 * 🔌 Connect to AI system
 */
function initRealtime(eventbus) {

  eventbus.on("AI_OUTPUT", (data) => {
    broadcast({
      type: "AI_STREAM",
      payload: data,
      timestamp: Date.now()
    });
  });

  eventbus.on("MARKET_EVENT", (data) => {
    broadcast({
      type: "MARKET_STREAM",
      payload: data,
      timestamp: Date.now()
    });
  });
}

module.exports = {
  subscribe,
  broadcast,
  initRealtime
};
