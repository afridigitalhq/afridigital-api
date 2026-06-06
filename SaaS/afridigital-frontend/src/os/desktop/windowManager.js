class WindowManager {
  constructor() {
    this.windows = [];
  }

  open(id, meta = {}) {
    const win = {
      id,
      title: meta.title || id,
      z: this.windows.length + 1,
      minimized: false,
      data: meta.data || {}
    };
    this.windows.push(win);
    console.log("🪟 OPEN WINDOW:", win.title);
    return win;
  }

  focus(id) {
    this.windows = this.windows.map(w =>
      ({ ...w, z: w.id === id ? this.windows.length : w.z })
    );
  }

  close(id) {
    this.windows = this.windows.filter(w => w.id !== id);
  }

  list() {
    return this.windows;
  }
}

export const wm = new WindowManager();
