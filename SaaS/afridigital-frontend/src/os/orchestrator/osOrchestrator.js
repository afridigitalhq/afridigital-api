import { commandBus } from "../../command/commandBus";
import { osMemory } from "../memory/osMemory";
import { executionGate } from "../governance/executionGate";
import { taskArbiter } from "../governance/taskArbiter";
import { shouldTrigger } from "../governance/loopGuard";

class OSOrchestrator {
  constructor() {
    this.history = [];
  }

  async init() {
    console.log("🧠 V11.5 CONTROLLED AUTONOMY ACTIVE");
  }

  async ingest(input) {
    const cmd = this._simpleParse(input);

    if (!shouldTrigger(this.history, cmd.action)) {
      return { blocked: true };
    }

    taskArbiter.add(cmd);

    return this._process();
  }

  _process() {
    const task = taskArbiter.next();
    if (!task) return;

    if (!executionGate.canExecute(task.action, task.payload)) {
      return { blocked: true };
    }

    this.history.push(task);

    osMemory.set("last_command", task);

    return commandBus.execute(task.action, task.payload);
  }

  _simpleParse(text) {
    const t = text.toLowerCase();

    if (t.includes("logs")) return { action: "open_logs" };
    if (t.includes("flowgraph")) return { action: "open_flowgraph" };

    return { action: "noop", payload: {} };
  }
}

export const osOrchestrator = new OSOrchestrator();
