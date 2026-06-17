const state = {
  failures: 0,
  open: false,
  lastFail: 0
};

const THRESHOLD = 5;
const RESET_TIME = 30000;

module.exports = {
  allow() {
    if (!state.open) return true;

    const now = Date.now();
    if (now - state.lastFail > RESET_TIME) {
      state.open = false;
      state.failures = 0;
      return true;
    }

    return false;
  },

  recordSuccess() {
    state.failures = 0;
    state.open = false;
  },

  recordFailure() {
    state.failures++;
    state.lastFail = Date.now();

    if (state.failures >= THRESHOLD) {
      state.open = true;
    }
  }
};
