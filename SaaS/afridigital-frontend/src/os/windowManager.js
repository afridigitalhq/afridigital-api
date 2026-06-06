import { EventEmitter } from "events";

export const WindowManager = new EventEmitter();

WindowManager.state = {
  windows: []
};

WindowManager.create = (win) => {
  const id = Date.now().toString();
  const window = {
    id,
    x: 80,
    y: 80,
    width: 420,
    height: 300,
    title: win.title || "Window",
    type: win.type || "panel"
  };

  WindowManager.state.windows.push(window);
  WindowManager.emit("window:create", window);

  return window;
};
