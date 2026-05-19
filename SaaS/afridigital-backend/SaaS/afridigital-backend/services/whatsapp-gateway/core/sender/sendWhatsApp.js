module.exports = async function sendWhatsApp(to, message) {
  console.log("📲 MOCK WhatsApp SEND:", { to, message });

  return {
    success: true,
    mock: true,
    to,
    message
  };
};
