import { windowManager } from "../desktop/windowManager.js";

export const resizeEngine = {
  init() {},

  resize(id, width, height) {
    windowManager.resize(id, width, height);
  }
};
