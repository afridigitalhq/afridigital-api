const fs = require('fs');

const file = './adapters/whatsapp/sendMessage.js';

console.log('🧠 FORCING REAL META WHATSAPP INTEGRATION...');

const real = `
const axios = require('axios');

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERSION = 'v19.0';

async function sendMessage(to, text) {
  try {
    console.log('📤 REAL META SEND →', to);

    const url = \`https://graph.facebook.com/\${VERSION}/\${PHONE_ID}/messages\`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: text
      }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: \`Bearer \${TOKEN}\`,
        "Content-Type": "application/json"
      }
    });

    console.log('✅ META RESPONSE:', res.data);

    return res.data;

  } catch (err) {
    console.error('❌ META SEND ERROR:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { sendMessage };
`;

fs.writeFileSync(file, real);

console.log('✔ REAL WHATSAPP SEND FORCED');
