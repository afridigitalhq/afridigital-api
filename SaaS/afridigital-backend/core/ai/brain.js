const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  async think({ user, message, flow }) {

    if (flow === "wallet.transfer") {
      return "💸 Transfer detected. Please enter recipient and amount.";
    }

    if (flow === "marketplace.earn") {
      return "💼 Opening earning opportunities...";
    }

    if (flow === "assistant.chat") {
      return "🧠 AI Assistant online. Ask me anything.";
    }

    return "👋 Welcome to AfriDigital AI OS.";
  }
};
