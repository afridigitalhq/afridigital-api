const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

module.exports = async function sendWhatsApp(to, message){
  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    })
  });

  const data = await res.json().catch(()=>({}));
  console.log('📤 WA RESPONSE:', data);

  return data;
};
