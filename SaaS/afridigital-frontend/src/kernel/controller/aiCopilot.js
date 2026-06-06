import { aiController } from "./aiController.js";

export const aiCopilot = {
  init() {},

  run(commandText) {
    return aiController.handleInput(commandText);
  }
};
