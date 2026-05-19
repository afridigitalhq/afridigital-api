console.log("\n🚀 V14 GLOBAL EVENT CLOUD KERNEL START\n");

require("../workers/ai.worker.cjs");
require("../workers/healer.worker.cjs");
require("../sync/render.sync.v14.cjs");

const fabric = require("../cloud/fabric.cjs");

// BOOT EVENT INTO GLOBAL CLOUD FABRIC
setTimeout(() => {
  fabric.emit("MESSAGE_RECEIVED", {
    from: "user",
    text: "Hello global cloud kernel"
  });
}, 1000);

console.log("\n🌍 V14 GLOBAL EVENT CLOUD ACTIVE\n");
