const queue = [];

module.exports = {
  enqueue(event) {
    queue.push({ ...event, retries: 0 });
  },

  get() {
    return queue.shift();
  },

  retry(event) {
    if (event.retries >= 3) return false;

    event.retries++;
    queue.push(event);
    return true;
  },

  size() {
    return queue.length;
  }
};
