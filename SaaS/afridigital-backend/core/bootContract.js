const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = function safeModule(module) {
  if (!module) return {
    boot: async () => ({ ok: false, skipped: true }),
    init: async () => ({ ok: false }),
    status: async () => ({ ok: false })
  };

  return {
    boot: module.boot || (async () => ({ ok: true })),
    init: module.init || (async () => ({ ok: true })),
    start: module.start || (async () => ({ ok: true })),
    stop: module.stop || (async () => ({ ok: true })),
    status: module.status || (async () => ({ ok: true, mode: "active" }))
  };
};
