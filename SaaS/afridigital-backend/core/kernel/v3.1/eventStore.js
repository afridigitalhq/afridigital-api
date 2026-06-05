const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs/event.log');

function append(event) {
  const line = JSON.stringify({
    ...event,
    ts: Date.now()
  }) + "\n";

  fs.appendFileSync(LOG_FILE, line);
}

function readAll() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split('\n')
    .map(l => {
      try { return JSON.parse(l); } catch { return null; }
    })
    .filter(Boolean);
}

module.exports = { append, readAll };
