const memory = {};

module.exports = {
  set: (k,v) => memory[k] = v,
  get: (k) => memory[k],
  all: () => memory
};
