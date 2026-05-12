const { assertApiVersion } = require("../runtime/safety/api.guard");
function boot() {
  console.log('🚀 AFRIDIGITAL V6.3 BOOT STRAP');

  require('../system/runtime.status').runtimeStatus?.();
  require('../system/live.runtime').liveBoot?.();

  console.log('🧠 Core Bootstrap Complete');
}

module.exports = { boot };
