const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'queue.json');

// ensure file exists
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');

function readQueue() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeQueue(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// enqueue message
function pushQueue(msg) {
  const q = readQueue();
  q.push({
    ...msg,
    timestamp: Date.now(),
    attempts: msg.attempts || 0
  });
  writeQueue(q);
}

// dequeue message
function popQueue() {
  const q = readQueue();
  const msg = q.shift();
  writeQueue(q);
  return msg || null;
}

module.exports = { pushQueue, popQueue };
