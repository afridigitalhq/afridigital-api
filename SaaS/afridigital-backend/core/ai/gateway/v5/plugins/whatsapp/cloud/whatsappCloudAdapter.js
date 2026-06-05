const config = require(require('../../../../core/kernel/entry')).config;

const TOKEN = config.get('whatsapp.token') || config.get("whatsapp.token");
const PHONE_ID = config.get('whatsapp.phoneId') || config.get("whatsapp.phoneId");

module.exports = {
  sendText: async (to, text) => {
    const cloud = require('./whatsappCloudTransport');
    return cloud.sendText(to, text, TOKEN, PHONE_ID);
  }
};
