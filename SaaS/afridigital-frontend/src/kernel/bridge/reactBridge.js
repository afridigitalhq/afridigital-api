import { windowStore } from "../window/windowStore.js";

/**
 * React → Kernel Sync Layer
 * Binds UI state to OS kernel
 */

export const reactBridge = {
  init(setStateCallback) {
    windowStore.subscribe((windows) => {
      setStateCallback([...windows]);
    });
  }
};
