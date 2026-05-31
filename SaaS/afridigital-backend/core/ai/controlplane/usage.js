const logs = [];

function record(entry) {
  logs.push({
    ...entry,
    ts: Date.now()
  });
}

function getAll() {
  return logs;
}

module.exports = { record, getAll };
