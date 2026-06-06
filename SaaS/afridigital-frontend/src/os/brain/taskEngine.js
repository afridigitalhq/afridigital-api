/**
 * AUTONOMOUS TASK ENGINE
 */

export class TaskEngine {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.queue = [];
  }

  add(task) {
    this.queue.push(task);
  }

  run() {
    setInterval(() => {
      const task = this.queue.shift();
      if (!task) return;

      console.log("⚙️ Executing autonomous task:", task);

      this.orchestrator.execute(task.action, task.payload);
    }, 3000);
  }
}
