const router = require('express').Router();
const controller = require('../controllers/webhook.controller');

// ✅ META VERIFICATION (REQUIRED)
router.get('/', (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        console.log("Webhook VERIFIED by Meta");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// 📩 MESSAGE RECEIVER
router.post('/', controller.handleWebhook);

module.exports = router;
