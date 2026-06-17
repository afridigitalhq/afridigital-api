const base = require('./whatsappCloudAdapter');

class WhatsAppCloudAdapterV2 {
  async sendMessage({ to, text }) {
    // PURE COMPATIBILITY LAYER
    return base.sendText(to, text);
  }

  async sendText(to, text) {
    return base.sendText(to, text);
  }
}

module.exports = new WhatsAppCloudAdapterV2();
