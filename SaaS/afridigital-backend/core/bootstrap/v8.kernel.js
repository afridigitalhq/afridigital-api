const express = require('express');

const { handleIngress } = require('../runtime/whatsapp/ingress');
const { bootDelivery } = require('../runtime/whatsapp/delivery');

function boot(app) {

  console.log('🚀 V8 CLEAN KERNEL BOOTING...');

  // attach webhook route
  app.post('/webhook', async (req, res) => {
    await handleIngress(req.body);
    res.sendStatus(200);
  });

  // start delivery system
  bootDelivery();

  console.log('🧠 V8 KERNEL ONLINE');
}

module.exports = { boot };
