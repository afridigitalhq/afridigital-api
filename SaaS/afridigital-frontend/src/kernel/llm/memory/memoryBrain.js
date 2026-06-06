const storeKey = "ai_memory_v20";

export const memoryBrain = {
  init() {},

  save(entry) {
    const existing = JSON.parse(localStorage.getItem(storeKey) || "[]");
    existing.push({ ...entry, ts: Date.now() });
    localStorage.setItem(storeKey, JSON.stringify(existing));
  },

  search(query) {
    const data = JSON.parse(localStorage.getItem(storeKey) || "[]");
    return data.filter(d => JSON.stringify(d).includes(query));
  }
};
