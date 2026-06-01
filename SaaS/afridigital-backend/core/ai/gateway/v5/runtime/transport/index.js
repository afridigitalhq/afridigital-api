const config = require(process.cwd() + '/core/kernel/entry').config;

const TOKEN =
  config.get('whatsapp.token') ||
  process.env.WHATSAPP_TOKEN;

const PHONE_ID =
  config.get('whatsapp.phoneId') ||
  process.env.WHATSAPP_PHONE_ID;

const cloud = require('../../plugins/whatsapp/cloud/whatsappCloudTransport');

module.exports = {
  sendText: async (to, text) => {
    return cloud.sendText(to, text, TOKEN, PHONE_ID);
  }
};
