module.exports = {
  sendMessage: async (msg) => {
    console.log("📩 [MOCK WHATSAPP]", msg);
    return { status: "mock_sent", id: Date.now() };
  },

  verifyWebhook: () => {
    console.log("🔐 MOCK WHATSAPP VERIFY");
    return true;
  }
};
