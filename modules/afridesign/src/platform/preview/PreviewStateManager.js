let state = {
  mode: "launch",
  project: null,
  device: null
};

const PreviewStateManager = {
  current() {
    return { ...state };
  },

  open(project = null) {
    state = { mode: "gallery", project, device: null };
    return this.current();
  },

  gallery() {
    state = { ...state, mode: "gallery", device: null };
    return this.current();
  },

  focus(device) {
    state = { ...state, mode: "focus", device };
    return this.current();
  },

  back() {
    state = { ...state, mode: "gallery", device: null };
    return this.current();
  },

  exit() {
    state = { mode: "launch", project: null, device: null };
    return this.current();
  }
};

export default PreviewStateManager;
