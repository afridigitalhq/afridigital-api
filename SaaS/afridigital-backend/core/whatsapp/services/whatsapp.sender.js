const axios = require('axios');
require('dotenv').config();

async function sendWhatsAppMessage(to, message) {

  const url =
`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  try {

    const response =
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            Authorization:
`Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type':
'application/json'
          }
        }
      );

    return response.data;

  } catch (err) {

    console.log(
      '❌ WhatsApp Send Error',
      err.response?.data || err.message
    );
  }
}

module.exports = {
  sendWhatsAppMessage
};
