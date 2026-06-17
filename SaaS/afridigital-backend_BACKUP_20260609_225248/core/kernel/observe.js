module.exports = function observe() {
  return {
    status: "active",
    metrics: {
      cpu: 0,
      memory: 0
    },
    events: [],
    ts: Date.now()
  };
};
