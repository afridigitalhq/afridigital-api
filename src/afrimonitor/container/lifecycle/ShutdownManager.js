export class ShutdownManager {
  constructor() {
    this.tasks = [];
  }

  register(task) {
    if (typeof task === "function") this.tasks.push(task);
  }

  async shutdown() {
    for (const task of this.tasks) {
      await task();
    }
  }
}
