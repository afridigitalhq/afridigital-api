const memory = [];

export const memoryGraph = {
  init() {
    memory.length = 0;
  },

  add(event) {
    memory.push({
      ...event,
      ts: Date.now()
    });
  },

  getAll() {
    return memory;
  }
};
