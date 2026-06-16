class Dispatcher {
  constructor() {
    this.queue = [];
    this.active = false;
  }

  submit(task) {
    this.queue.push(task);
  }

  async start() {
    if (this.active) return;
    this.active = true;

    while (this.queue.length) {
      const task = this.queue.shift();
      await task();
    }

    this.active = false;
  }
}

module.exports = { Dispatcher };
