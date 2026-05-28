module.exports = {
  wrap(event) {
    return {
      v: 1,
      ts: Date.now(),
      id: event.id || null,
      type: event.type,
      user: event.from || event.user,
      payload: event,
      meta: {
        source: "whatsapp",
        version: "v2"
      }
    };
  }
};
