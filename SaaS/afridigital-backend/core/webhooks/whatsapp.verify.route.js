const express = require('express');
const router = express.Router();

const { verify } =
require('../verification/webhook.verify');

router.get('/webhook/whatsapp',
verify);

module.exports = router;
