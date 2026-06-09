const listeners = new Set();

function registerServer(fn) {
  if (typeof fn !== "function") return;
  listeners.add(fn);
}

function getListeners() {
  return Array.from(listeners);
}

function blockDirectListen() {
  throw new Error("DIRECT listen() DISABLED — use registerServer()");
}

module.exports = {
  registerServer,
  getListeners,
  blockDirectListen
};
