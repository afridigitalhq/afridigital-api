export const WindowSystem = {
  windows: [],
  activeWindow: null,

  create(win) {
    const id = Date.now().toString();

    const window = {
      id,
      title: win.title || "App",
      x: 100,
      y: 100,
      width: 500,
      height: 350,
      z: this.windows.length + 1
    };

    this.windows.push(window);
    this.focus(id);
    return window;
  },

  focus(id) {
    this.activeWindow = id;
    this.windows = this.windows.map(w =>
      w.id === id ? { ...w, z: 999 } : { ...w, z: w.z }
    );
  },

  move(id, x, y) {
    this.windows = this.windows.map(w =>
      w.id === id ? { ...w, x, y } : w
    );
  }
};
