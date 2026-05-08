const sessions = new Map();

module.exports = {
  set(user, data = {}) {
    const old = sessions.get(user) || {};
    sessions.set(user, { ...old, ...data, updatedAt: Date.now() });
    return sessions.get(user);
  },

  get(user) {
    return sessions.get(user) || {};
  },

  classify(message = "") {
    const text = message.toLowerCase();

    if(text.includes("earn")) return "earning";
    if(text.includes("sell")) return "commerce";
    if(text.includes("transfer")) return "wallet";
    if(text.includes("pay")) return "payment";
    if(text.includes("dashboard")) return "upgrade";
    if(text.includes("help")) return "support";

    return "general";
  }
};
