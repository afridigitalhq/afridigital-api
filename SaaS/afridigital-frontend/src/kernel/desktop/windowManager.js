const state = {
  windows: [],
  zIndex: 1,
  listeners: []
};

export const windowManager = {
  init() {
    state.windows = [];
    state.zIndex = 1;
  },

  subscribe(fn) {
    state.listeners.push(fn);
  },

  notify() {
    state.listeners.forEach(fn => fn([...state.windows]));
  },

  open(win) {
    state.windows.push({
      id: win.id,
      title: win.title,
      x: 80,
      y: 80,
      width: 600,
      height: 400,
      z: state.zIndex++,
      minimized: false,
      data: win.data || {}
    });

    this.notify();
  },

  close(id) {
    state.windows = state.windows.filter(w => w.id !== id);
    this.notify();
  },

  focus(id) {
    const win = state.windows.find(w => w.id === id);
    if (!win) return;

    win.z = state.zIndex++;
    this.notify();
  },

  move(id, x, y) {
    const win = state.windows.find(w => w.id === id);
    if (!win) return;

    win.x = x;
    win.y = y;
    this.notify();
  },

  resize(id, width, height) {
    const win = state.windows.find(w => w.id === id);
    if (!win) return;

    win.width = width;
    win.height = height;
    this.notify();
  },

  getAll() {
    return state.windows;
  }
};
