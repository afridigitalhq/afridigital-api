export const WindowManager = {
  windows: [],
  active: null,

  create(win) {
    const id = Date.now().toString();

    const window = {
      id,
      title: win.title,
      x: 120,
      y: 120,
      width: 520,
      height: 360,
      z: this.windows.length + 1
    };

    this.windows.push(window);
    this.focus(id);

    return window;
  },

  focus(id) {
    this.active = id;
    this.windows = this.windows.map(w =>
      w.id === id ? { ...w, z: 999 } : w
    );
  },

  move(id, x, y) {
    this.windows = this.windows.map(w =>
      w.id === id ? { ...w, x, y } : w
    );
  }
};
