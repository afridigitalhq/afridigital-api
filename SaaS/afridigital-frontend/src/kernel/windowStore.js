const state = {
  windows: [],
  active: null
};

export const windowStore = {
  init() {
    state.windows = [];
    state.active = null;
  },

  open(win) {
    state.windows.push(win);
    state.active = win.id;
  },

  close(id) {
    state.windows = state.windows.filter(w => w.id !== id);
  },

  list() {
    return state.windows;
  },

  getActive() {
    return state.active;
  }
};
