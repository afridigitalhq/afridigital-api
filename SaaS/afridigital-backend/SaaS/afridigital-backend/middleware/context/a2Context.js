const buildContext = require("../../services/context/buildContext");

async function a2Context(req, res, next) {
  try {
    const phone = req.body.from || req.body.phone;
    const message = req.body.text || req.body.message;

    req.a2 = await buildContext(phone, message, "whatsapp");

    next();
  } catch (err) {
    console.error("A2 Context Error:", err);
    res.sendStatus(500);
  }
}

module.exports = a2Context;
