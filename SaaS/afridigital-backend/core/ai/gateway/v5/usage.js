const usage = [];

function log(data) {
  usage.push({ ...data, ts: Date.now() });
}

function getAll() {
  return usage;
}

module.exports = { log, getAll };
