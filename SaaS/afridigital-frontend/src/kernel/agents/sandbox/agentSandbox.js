import { eventBus } from "../../events/eventBus.js";

export const agentSandbox = {
  init() {},

  execute(task) {
    // STRICT RULE: agents cannot mutate kernel directly
    if (!task || task.type === "KERNEL_MUTATION") {
      console.warn("🛑 BLOCKED UNSAFE AGENT TASK");
      return;
    }

    eventBus.emit("AGENT_SAFE_EXECUTION", {
      id: task.id,
      result: `processed:${task.type}`
    });
  }
};
