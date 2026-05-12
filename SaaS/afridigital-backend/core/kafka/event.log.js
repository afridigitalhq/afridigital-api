
// EVENT LOG (Kafka-style append-only stream)
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'event.log.json');

function append(topic, event) {
  const log = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE))
    : [];

  const record = {
    id: Date.now() + '-' + Math.random(),
    topic,
    event,
    timestamp: new Date().toISOString()
  };

  log.push(record);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

  return record;
}

function read(topic) {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE))
    .filter(r => r.topic === topic);
}

module.exports = { append, read };

