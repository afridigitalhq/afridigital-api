const registry = require('../cluster/node.registry');
const broker = require('../cluster/distributed.broker');
global.broker = broker;
const { attachKafkaBridge } = require('../kernel/events/kafka.bridge');
attachKafkaBridge();
const { attachRealtime } = require('../kernel/events/realtime.bridge');
attachRealtime(require('../kernel/events/event.bus'));
const timeTravel = require("../kernel/time.travel");
timeTravel.enableTrace(false);
const kernel = require("../kernel/afri.kernel");
kernel.boot();

const { initRuntimeKernel } = require("../runtime/kernel/runtime.state");
initRuntimeKernel();

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
require("../kernel/workers/wallet.worker");
require('../kernel/workers/ledger.worker');
require('../kernel/workers/projection.worker');
require('../kernel/workers/finality.worker');
require('../kernel/workers/double.entry.worker');
require('../cluster/ledger.node');

// --- CLUSTER SELF REGISTRATION ---
registry.register({
  id: process.env.NODE_ID || "node-1",
  role: "api",
  status: "healthy",
  region: "afri-west"
});
