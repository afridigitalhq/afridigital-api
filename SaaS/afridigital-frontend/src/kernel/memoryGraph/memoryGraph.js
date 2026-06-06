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

    if (memory.length > 500) memory.shift();
  },

  getAll() {
    return memory;
  },

  query(type) {
    return memory.filter(m => m.type === type);
  }
};
