const state = {
  windows: [],
  listeners: []
};

export const windowStore = {
  init() {
    state.windows = [];
  },

  subscribe(fn) {
    state.listeners.push(fn);
  },

  notify() {
    state.listeners.forEach(fn => fn(state.windows));
  },

  open(win) {
    state.windows.push({
      id: win.id,
      title: win.title,
      data: win.data || {},
      minimized: false,
      ts: Date.now()
    });
    this.notify();
  },

  close(id) {
    state.windows = state.windows.filter(w => w.id !== id);
    this.notify();
  },

  getAll() {
    return state.windows;
  }
};
