const { lockKernelInstance } = require("./_enforce/kernel.checksum");
const { bindDispatch } = require("./_enforce/dispatch.trampoline");
const { freezeKernelSurface } = require("./_enforce/syscall.sandbox");
const { hookDispatch } = require("./_enforce/soc.heatmap");
const { hookDispatch } = require("./_enforce/soc.heatmap");
lockKernelInstance(kernel);
kernel.dispatch = bindDispatch(kernel.dispatch.bind(kernel));
kernel.dispatch = hookDispatch(kernel.dispatch);
freezeKernelSurface(kernel);
const { freezeKernelSurface } = require("./_enforce/syscall.sandbox");
const { bindDispatch } = require("./_enforce/dispatch.trampoline");
const { lockKernelInstance } = require("./_enforce/kernel.checksum");
kernel.dispatch = hookDispatch(kernel.dispatch.bind(kernel));
freezeKernelSurface(kernel);
kernel.dispatch = bindDispatch(kernel.dispatch.bind(kernel));
lockKernelInstance(kernel);
const { enforceNoMultipleInstances } = require("./_enforce/syscallgate.guard"); enforceNoMultipleInstances();
// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { SyscallGate } = require("./syscall/SyscallGate");

const kernel = new SyscallGate({
  ledger: require("../ledger"),
  router: require("../router"),
  validator: require("../safety/validator"),
  broadcaster: require("../realtime/ws/broadcaster")
});

module.exports = kernel;
