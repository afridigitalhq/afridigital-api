const state = {
  ollama: {
    success: 0,
    fail: 0,
    latency: [],
    circuit: "CLOSED"
  },
  mock: {
    success: 0,
    fail: 0,
    latency: [],
    circuit: "CLOSED"
  },
  openai: {
    success: 0,
    fail: 0,
    latency: [],
    circuit: "CLOSED"
  }
};

function get(name) {
  return state[name];
}

function all() {
  return state;
}

module.exports = { get, all };
