module.exports = {
  create(payload) {
    return {
      id: "USR-" + Date.now(),
      ...payload,
      createdAt: new Date().toISOString()
    };
  }
};
