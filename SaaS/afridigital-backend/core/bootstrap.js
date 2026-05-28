const { recover } = require("./recovery/bootRecovery");
const { startWatchdog } = require("./watchdog/kernelWatchdog");
const { loop } = require("./kernel/afriKernelV7");

console.log("🚀 V8 FULL WIRE-IN BOOT");

recover();
startWatchdog();

undefined

console.log("🧠 V8 SYSTEM ONLINE (DETACHED MODE)");
