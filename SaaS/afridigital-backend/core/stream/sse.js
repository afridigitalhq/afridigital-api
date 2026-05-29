const clients = new Map();

function add(id, res) {
  clients.set(id, res);
}

function send(id, token) {
  const res = clients.get(id);
  if (!res) return;

  res.write(`data: ${JSON.stringify({ token })}\n\n`);
}

function close(id) {
  const res = clients.get(id);
  if (res) res.end();
  clients.delete(id);
}

module.exports = { add, send, close };
