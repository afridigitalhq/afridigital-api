const sendWhatsApp = require('../../sender/sendWhatsApp');

module.exports = {
  sendWhatsApp: async ({ to, message }) => {
    return await sendWhatsApp(to, message);
  }
};
