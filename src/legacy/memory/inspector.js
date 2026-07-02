function inspectMemory(state) {
  return {
    keys: Object.keys(state || {}),
    size: JSON.stringify(state || {}).length
  };
}

module.exports = { inspectMemory };
