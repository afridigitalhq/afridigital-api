
const crypto = require('crypto');

function verifySignature(req, secret) {
  try {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;

    const body = JSON.stringify(req.body);
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return signature === `sha256=${hash}`;
  } catch (e) {
    return false;
  }
}

module.exports = { verifySignature };

