const cloud = require("./cloud/whatsappCloudAdapter");

class A2CloudBridge {
  async forward(to, text) {
    try {
      const res = await cloud.sendText(to, text);
      return { ok: true, cloud: true, res };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

module.exports = new A2CloudBridge();
