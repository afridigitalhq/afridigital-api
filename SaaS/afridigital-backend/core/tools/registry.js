module.exports = {
  echo: async (input) => {
    return `echo:${input}`;
  },

  getTime: async () => {
    return new Date().toISOString();
  }
};
