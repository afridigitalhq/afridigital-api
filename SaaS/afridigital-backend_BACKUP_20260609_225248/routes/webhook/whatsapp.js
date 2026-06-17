
const { handleMessage } = require('../../core/whatsapp/controller');

module.exports = async (req, res) => {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.json(result);
    }

    const payload = {
      text: message.text?.body || '',
      from: message.from,
      raw: req.body
    };

    const result = await handleMessage(payload);

    return res.json(result);

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message
    });
  }
};
