import { eventBus } from "../../events/eventBus.js";

const queue = [];

export const taskScheduler = {
  init() {
    eventBus.on("AGENT_SCHEDULE_TASK", (task) => {
      queue.push({
        ...task,
        status: "QUEUED",
        ts: Date.now()
      });
    });

    this.run();
  },

  run() {
    setInterval(() => {
      const task = queue.shift();
      if (!task) return;

      eventBus.emit("AGENT_EXECUTE_TASK", task);
    }, 1000);
  }
};
