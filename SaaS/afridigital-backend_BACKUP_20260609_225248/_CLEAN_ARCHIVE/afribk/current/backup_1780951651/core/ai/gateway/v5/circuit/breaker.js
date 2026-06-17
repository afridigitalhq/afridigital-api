const state = {};

function isOpen(provider) {
  return state[provider]?.openUntil > Date.now();
}

function trip(provider) {
  state[provider] = {
    openUntil: Date.now() + 15000
  };
}

function ok(provider) {
  return !isOpen(provider);
}

module.exports = { isOpen, trip, ok };
