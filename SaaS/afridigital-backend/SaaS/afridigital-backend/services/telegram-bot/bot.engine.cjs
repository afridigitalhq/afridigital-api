module.exports = {
  sendMessage: async () => true,
  receive: async () => null,
  init: async () => true,
  health: () => ({ ok: true, service: "telegram-bot-stub" })
};
