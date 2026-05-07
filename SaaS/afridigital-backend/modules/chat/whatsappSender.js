const axios = require("axios");

module.exports = async function sendWhatsApp(to, message) {
  try {
    const url =
      "https://graph.facebook.com/v19.0/" +
      process.env.WHATSAPP_PHONE_ID +
      "/messages";

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("WhatsApp sent:", response.data);

    return response.data;

  } catch (err) {
    console.error(
      "WhatsApp send error:",
      err.response?.data || err.message
    );
  }
};
