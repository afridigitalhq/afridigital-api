const queue = [];

function enqueue(msg) {
  queue.push(msg);
}

function dequeue() {
  return queue.shift();
}

function size() {
  return queue.length;
}

module.exports = { enqueue, dequeue, size };
