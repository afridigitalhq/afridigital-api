export const aiScheduler = {
  queue: [],

  init() {
    setInterval(() => {
      this.run();
    }, 3000);
  },

  add(task) {
    this.queue.push({ ...task, ts: Date.now() });
  },

  run() {
    const task = this.queue.shift();
    if (!task) return;

    console.log("⏱ EXECUTING SCHEDULED TASK:", task.type);
  }
};
