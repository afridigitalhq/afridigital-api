const { assertApiVersion } = require("../runtime/safety/api.guard");
require('dotenv').config();

const { checkEnv } =
require('../config/env.check');

function runtimeBoot() {

  console.log('🚀 AFRICONTROL RUNTIME START');

  const valid =
    checkEnv();

  if (!valid) {

    console.log('❌ RUNTIME BOOT FAILED');
    process.exit(1);
  }

  console.log('━━━━━━━━━━━━━━━━━━━');
  console.log('🧠 AfriAI Runtime Online');
  console.log('📡 WhatsApp Cloud Connected');
  console.log('🔐 Admin Guard Active');
  console.log('⚡ Execution Engine Ready');
  console.log('🌍 Ecosystem Runtime Stable');
  console.log('━━━━━━━━━━━━━━━━━━━');
}

module.exports = { runtimeBoot };
