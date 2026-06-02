const clients = [];

function register(res) {
  clients.push(res);
}

function broadcast(event) {
  const payload = JSON.stringify(event);
  clients.forEach(res => res.write(`data: ${payload}\n\n`));
}

module.exports = { register, broadcast };
