
const config = require('../../../kernel/_resolveKernel').config;

const TOKEN = config.meta.token;
const PHONE_ID = config.meta.phoneId;

const cloud = require('../../plugins/whatsapp/cloud/whatsappCloudTransport');

module.exports = {
  sendText: async (to, text) => {
    return cloud.sendText(to, text, TOKEN, PHONE_ID);
  }
};
