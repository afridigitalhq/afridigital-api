const SENT_LOCK=new Set();
const sent = new Set();

async function bootDelivery() {
  console.log('📤 DELIVERY LAYER ONLINE');
}

async function sendWhatsAppMessage(to, text) {

  const key = to + ':' + text;

  if (sent.has(key)) {
    console.log('⛔ DUPLICATE BLOCKED');
    return;
  }

  sent.add(key);

  try {

    console.log('📤 META SEND:', to, text);

    const response = await fetch(
      'https://graph.facebook.com/v22.0/' +
      process.env.WHATSAPP_PHONE_NUMBER_ID +
      '/messages',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.WHATSAPP_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body: text
          }
        })
      }
    );

    const data = await response.json();

    console.log('✅ META RESPONSE:', JSON.stringify(data));

  } catch (err) {

    console.error('❌ DELIVERY ERROR:', err);

  } finally {

    setTimeout(() => {
      sent.delete(key);
    }, 5000);

  }
}

module.exports = {
  bootDelivery,
  sendWhatsAppMessage
};
