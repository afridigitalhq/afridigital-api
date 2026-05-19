const { load, save } = require('./store');

const subscribers = new Set();
let history = load() || [];

/**
 * AFRIDIGITAL A2 EVENT BUS (SINGLE SOURCE OF TRUTH)
 */

function publish(event) {
  history.push(event);

  // hard cap memory
  if (history.length > 10000) history = history.slice(-10000);

  // persist immediately (Time Machine integrity)
  save(history);

  // broadcast to all live clients
  for (const ws of subscribers) {
    try {
      ws.send(JSON.stringify(event));
    } catch (e) {}
  }
}

function subscribe(ws) {
  subscribers.add(ws);
  ws.on("close", () => subscribers.delete(ws));
}

function getHistory() {
  return history;
}

function clearHistory() {
  history = [];
  save(history);
}

module.exports = {
  publish,
  subscribe,
  getHistory,
  clearHistory
};
