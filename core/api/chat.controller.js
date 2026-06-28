const { routeMessage } = require("../ai/afriai.router");

/**
 * API CONTROLLER
 * Clean boundary between WhatsApp and system logic
 */
function chatController(req, res) {
  try {
    const response = routeMessage(req.body);
    res.json({ success: true, reply: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { chatController };
