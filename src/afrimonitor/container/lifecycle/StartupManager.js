export class StartupManager {
  constructor() {
    this.tasks = [];
  }

  register(task) {
    if (typeof task === "function") this.tasks.push(task);
  }

  async start() {
    for (const task of this.tasks) {
      await task();
    }
  }
}
