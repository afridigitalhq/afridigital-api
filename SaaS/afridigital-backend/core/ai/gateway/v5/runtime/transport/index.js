const cloud = require("../../plugins/whatsapp/cloud/whatsappCloudTransport");

/**
 * SINGLE SOURCE OF TRUTH TRANSPORT
 * WhatsApp Cloud API v20 only
 */
module.exports = {
  sendText: async (to, text) => {
    return cloud.sendText(to, text);
  }
};
