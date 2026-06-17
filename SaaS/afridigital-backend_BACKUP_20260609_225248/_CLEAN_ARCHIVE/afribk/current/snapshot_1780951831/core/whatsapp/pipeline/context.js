module.exports = function buildContext(input) {
  return {
    timestamp: Date.now(),
    session: input.from,
    memory: {},
    input
  };
};
