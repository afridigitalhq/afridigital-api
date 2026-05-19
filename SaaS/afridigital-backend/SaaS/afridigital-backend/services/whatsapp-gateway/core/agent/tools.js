module.exports = {
  get_time: async () => {
    return new Date().toISOString();
  },

  echo: async ({ text }) => {
    return text;
  }
};