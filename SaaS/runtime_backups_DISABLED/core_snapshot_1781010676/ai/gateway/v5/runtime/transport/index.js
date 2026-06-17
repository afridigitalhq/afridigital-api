const config = require(process.cwd() + '/core/kernel/entry').config;

const TOKEN =
  config.get('whatsapp.token') ||
  config.get("whatsapp.token");

const PHONE_ID =
  config.get('whatsapp.phoneId') ||
  config.get("whatsapp.phoneId");

const cloud = require('../../plugins/whatsapp/cloud/whatsappCloudTransport');

module.exports = {
  sendText: async (to, text) => {
    return cloud.sendText(to, text, TOKEN, PHONE_ID);
  }
};
