module.exports = {
  boot: async () => ({ ok: true }),
  init: async () => ({ ok: true }),
  start: async () => ({ ok: true }),
  stop: async () => ({ ok: true }),
  status: async () => ({ ok: true, mode: "safe" })
};
