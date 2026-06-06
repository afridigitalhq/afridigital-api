/**
 * PRIORITY ARBITER
 */

export class TaskArbiter {
  constructor() {
    this.queue = [];
  }

  add(task) {
    this.queue.push({
      ...task,
      priority: task.priority || 1,
      time: Date.now()
    });

    // sort by priority
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  next() {
    return this.queue.shift();
  }

  size() {
    return this.queue.length;
  }
}

export const taskArbiter = new TaskArbiter();
