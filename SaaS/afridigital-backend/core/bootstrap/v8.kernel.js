const { assertApiVersion } = require("../runtime/safety/api.guard");
const express = require('express');

const { handleIngress } = require('../runtime/whatsapp/ingress');
const { bootDelivery } = require('../runtime/whatsapp/delivery');

function boot(app) {

  console.log('🚀 V8 CLEAN KERNEL BOOTING...');

  // attach webhook route
  // webhook disabled (moved to server.js)

  // start delivery system
  console.log("⚠️ bootDelivery missing - skipped");

  console.log('🧠 V8 KERNEL ONLINE');
}

module.exports = { boot };
