module.exports = {
  parse: async (msg) => {
    return { type: "general", raw: msg };
  }
};
