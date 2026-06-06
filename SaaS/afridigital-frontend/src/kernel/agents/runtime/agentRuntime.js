import { eventBus } from "../../events/eventBus.js";
import { taskScheduler } from "../scheduler/taskScheduler.js";
import { agentSandbox } from "../sandbox/agentSandbox.js";

export const agentRuntime = {
  init() {
    taskScheduler.init();

    eventBus.on("AGENT_EXECUTE_TASK", (task) => {
      agentSandbox.execute(task);
    });
  }
};
