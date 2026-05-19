const { assertApiVersion } = require("../runtime/safety/api.guard");
const { load, save } = require("../storage/message.store");

let queue = load();

function enqueueMessage(msg) {
  queue.push(msg);
  save(queue);
}

function dequeueMessage() {
  queue = load();
  const msg = queue.shift();
  save(queue);
  return msg;
}

function hasMessages() {
  queue = load();
  return queue.length > 0;
}

module.exports = { enqueueMessage, dequeueMessage, hasMessages };
