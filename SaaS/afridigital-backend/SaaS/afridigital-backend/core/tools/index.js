const sendWhatsApp = require('../../services/whatsapp-gateway/core/sender/sendWhatsApp');

module.exports = {
  "whatsapp.send": async ({ to, message }) => {
    return await sendWhatsApp(to, message);
  },

  "memory.set": async ({ key, value }) => {
    console.log("MEMORY SET:", key, value);
    return { stored: true };
  }
};
