class Scheduler {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  add(task) {
    this.queue.push(task);
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length) {
      const task = this.queue.shift();
      try {
        await task();
      } catch (e) {
        console.error("🧠 TASK FAILED:", e.message);
      }
    }

    this.running = false;
  }
}

module.exports = { Scheduler };
