/**
 * 🧠 AI OS WINDOW MANAGER KERNEL
 * controls layout + focus + workspace state
 */

const state = {
  windows: {},
  focus: null,
  workspace: "default"
};

/**
 * Register a window
 */
function registerWindow(id, meta = {}) {
  state.windows[id] = {
    id,
    x: meta.x || 0,
    y: meta.y || 0,
    w: meta.w || 400,
    h: meta.h || 300,
    visible: true,
    z: Object.keys(state.windows).length + 1
  };
}

/**
 * Move window (layout engine only)
 */
function moveWindow(id, x, y) {
  if (!state.windows[id]) return;

  state.windows[id].x = x;
  state.windows[id].y = y;
}

/**
 * Focus window
 */
function focusWindow(id) {
  if (!state.windows[id]) return;

  state.focus = id;

  // bring to front
  state.windows[id].z = Date.now();
}

/**
 * Toggle visibility
 */
function toggleWindow(id) {
  if (!state.windows[id]) return;

  state.windows[id].visible = !state.windows[id].visible;
}

/**
 * Save workspace snapshot
 */
function saveWorkspace(name) {
  state.workspace = name;

  return {
    name,
    snapshot: JSON.parse(JSON.stringify(state))
  };
}

/**
 * Load workspace snapshot
 */
function loadWorkspace(snapshot) {
  Object.assign(state, snapshot.snapshot || {});
}

/**
 * Read-only state
 */
function getWindowState() {
  return state;
}

module.exports = {
  registerWindow,
  moveWindow,
  focusWindow,
  toggleWindow,
  saveWorkspace,
  loadWorkspace,
  getWindowState
};
