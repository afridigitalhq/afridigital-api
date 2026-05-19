module.exports = {
  dispatch: async (task) => {
    console.log("Queue fallback dispatch:", task);
    return { ok: true, fallback: true };
  }
};
