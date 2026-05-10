const router = require('express').Router();
const controller = require('../controllers/webhook.controller');

router.post('/', controller.handleWebhook);

module.exports = router;
