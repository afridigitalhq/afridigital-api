const { assertApiVersion } = require("../runtime/safety/api.guard");
require('dotenv').config();

function checkEnv() {

  const required = [
    'AFRI_ADMIN_NUMBER',
    'AFRI_ADMIN_PASSWORD',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_VERIFY_TOKEN',
    'WHATSAPP_PROVIDER'
  ];

  const missing = [];

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length) {

    console.log('❌ MISSING ENV VALUES');
    console.log(missing);

    return false;
  }

  console.log('✅ ENV VALIDATION SUCCESS');

  console.log({
    ADMIN: process.env.AFRI_ADMIN_NUMBER,
    PHONE_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    VERIFY: process.env.WHATSAPP_VERIFY_TOKEN,
    PROVIDER: process.env.WHATSAPP_PROVIDER,
    TOKEN: process.env.WHATSAPP_ACCESS_TOKEN
      ? 'LOADED'
      : 'MISSING'
  });

  return true;
}

module.exports = { checkEnv };
