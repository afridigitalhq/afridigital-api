import { eventBus } from "../events/eventBus.js";

export const voiceEngine = {
  init() {},

  listen(text) {
    eventBus.emit("VOICE_COMMAND", { text });
  }
};
