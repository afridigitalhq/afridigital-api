const { startSupervisor } = require("./supervisor/supervisor");
const { loop } = require("./kernel/afriKernelV9");

console.log("🚀 AFRI V9 CORE BOOT START");

startSupervisor();
loop();

console.log("🚀 AFRI V9 CORE BOOT COMPLETE");
