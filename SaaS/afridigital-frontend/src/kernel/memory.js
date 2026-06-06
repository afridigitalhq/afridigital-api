export const Memory = {
  store: {},

  set(key, value) {
    this.store[key] = value;
  },

  get(key) {
    return this.store[key];
  }
};
