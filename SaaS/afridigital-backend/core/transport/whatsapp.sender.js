const { assertApiVersion } = require("../runtime/safety/api.guard");
async function sendWhatsAppMessage(to, message) {

  console.log('📤 Sending WhatsApp Message');
  console.log('TO:', to);
  console.log(message);

  return true;
}

module.exports = { sendWhatsAppMessage };
