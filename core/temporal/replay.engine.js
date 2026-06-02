const history = [];

function snapshot(state) {
  history.push({
    state,
    ts: Date.now()
  });
}

function replay(atTime) {
  return history.filter(h => h.ts <= atTime);
}

module.exports = { snapshot, replay };
