const fs = require('fs');

const file = 'core/stream/sse.js';

const code = `
const clients = new Map();

function add(id, res) {
  clients.set(id, res);
}

function send(id, evt) {
  const res = clients.get(id);
  if (!res) return;

  const payload = {
    type: evt?.type || "event",
    data: evt?.data ?? evt
  };

  res.write("data: " + JSON.stringify(payload) + "\\n\\n");
}

function pushEvent(id, evt) {
  return send(id, evt);
}

function close(id) {
  const res = clients.get(id);
  if (res) res.end();
  clients.delete(id);
}

module.exports = { add, send, pushEvent, close };
`;

fs.writeFileSync(file, code);
console.log("✔ SSE FIX APPLIED");
