import { llmRouter } from "./router/llmRouter.js";
import { functionExecutor } from "./tools/functionExecutor.js";
import { memoryBrain } from "./memory/memoryBrain.js";
import { eventBus } from "../events/eventBus.js";

export const llmBrain = {
  init() {},

  async process(input) {
    memoryBrain.save({ type: "USER_INPUT", input });

    const response = await llmRouter.ask(input);

    memoryBrain.save({ type: "LLM_OUTPUT", response });

    // simulate function calling layer
    if (input.includes("open")) {
      functionExecutor.execute({
        name: "open_window",
        args: { id: "auto-window" }
      });
    }

    eventBus.emit("LLM_RESPONSE", response);

    return response;
  }
};
