const sender = require("../whatsapp/sender");

module.exports = {
  async run(tool, payload) {
    if (tool === "send_message") {
      return sender.sendMessage(payload.to, payload.text);
    }
    return { ok: false, error: "unknown_tool" };
  }
};
