const fetch = require('node-fetch');

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

module.exports = async function sendWhatsApp(to, message){

  console.log('🔥 WHATSAPP OUTBOUND:', { to, message });

  if(!TOKEN || !PHONE_ID){
    console.warn('⚠️ WhatsApp not configured (Render env missing)');
    return { ok:false, error:'missing_env' };
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  };

  const res = await fetch(url,{
    method:'POST',
    headers:{
      'Authorization':'Bearer ' + TOKEN,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if(!res.ok){
    console.error('WHATSAPP_ERROR:', data);
  }

  return data;
};