const config = require(process.cwd() + '/core/kernel/entry').config;

const token =
  config.get('whatsapp.token') ||
  process.env.WHATSAPP_TOKEN;

const phoneId =
  config.get('whatsapp.phoneId') ||
  process.env.WHATSAPP_PHONE_ID;

if (!token || !phoneId) {
  console.error("❌ WhatsApp config missing");
}

module.exports = {
  sendText: async (to, text) => {
    const AUTH = {
      token,
      phoneId
    };

    if (!AUTH.token || !AUTH.phoneId) {
      throw new Error("WhatsApp auth not initialized");
    }

    return {
      messaging_product: "whatsapp",
      to,
      text,
      authorization: `Bearer ${AUTH.token}`
    };
  }
};
