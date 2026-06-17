const state = {
  ollama: { failCount: 0, blockedUntil: 0 },
  mock: { failCount: 0, blockedUntil: 0 },
  openai: { failCount: 0, blockedUntil: 0 }
};

function isOpen(provider) {
  return Date.now() > state[provider].blockedUntil;
}

function fail(provider) {
  state[provider].failCount++;

  if (state[provider].failCount > 3) {
    state[provider].blockedUntil = Date.now() + 30000; // 30s cooldown
    state[provider].failCount = 0;
  }
}

function success(provider) {
  state[provider].failCount = 0;
}

module.exports = { isOpen, fail, success };
