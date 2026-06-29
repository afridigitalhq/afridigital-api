const fs=require("fs");

const source=`const { SyscallGate } = require("./syscall/SyscallGate");

const { lockKernelInstance } = require("./_enforce/kernel.checksum");
const { bindDispatch } = require("./_enforce/dispatch.trampoline");
const { freezeKernelSurface } = require("./_enforce/syscall.sandbox");
const { hookDispatch } = require("./_enforce/soc.heatmap");

const kernel = new SyscallGate({
  ledger: require("../ledger"),
  router: require("../router"),
  validator: require("../safety/validator"),
  broadcaster: require("../realtime/ws/broadcaster")
});

// lifecycle hardening (single-pass, no duplication)
lockKernelInstance(kernel);

kernel.dispatch = bindDispatch(kernel.dispatch.bind(kernel));
kernel.dispatch = hookDispatch(kernel.dispatch);

freezeKernelSurface(kernel);

module.exports = kernel;
`;

fs.writeFileSync("core/kernel/index.js",source);

console.log("✅ Rebuilt core/kernel/index.js");
