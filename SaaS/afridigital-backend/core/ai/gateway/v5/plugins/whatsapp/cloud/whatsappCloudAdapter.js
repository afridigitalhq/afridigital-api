const config = require(process.cwd() + '/core/kernel/entry');

/**
 * SINGLE SOURCE CLOUD ADAPTER
 * DIRECT META GRAPH API EXECUTION
 */

async function sendText(to, text) {
  const token = config.meta.token;
  const phoneId = config.meta.phoneId;

  if (!token || !phoneId) {
    throw new Error('META CONFIG MISSING IN CLOUD ADAPTER');
  }

  const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    })
  });

  return res.json();
}

module.exports = { sendText };
