const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

module.exports = async function sendWhatsApp(to, message){

  if(!TOKEN || !PHONE_ID){
    throw new Error('Missing WhatsApp env vars');
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if(!res.ok){
    console.error('WHATSAPP_API_ERROR', data);
  }

  return data;
};