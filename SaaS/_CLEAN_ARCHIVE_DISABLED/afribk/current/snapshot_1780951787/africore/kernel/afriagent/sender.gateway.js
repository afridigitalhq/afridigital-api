const { sendMessage } = require("../../whatsapp/sender");

async function send({ to, message }) {
  if (!to || !message) return null;

  return await sendMessage({
    phone: to,
    text: message
  });
}

module.exports = { send };
