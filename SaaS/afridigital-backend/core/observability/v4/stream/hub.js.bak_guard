const clients = new Set();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

function broadcast(data) {
  for (const res of clients) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

module.exports = { addClient, removeClient, broadcast };
