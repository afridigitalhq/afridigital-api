const { tapSyscall } = require("../taps/kernel/syscall.tap");

function attachKernelTap(kernel) {
  const original = kernel.dispatch.bind(kernel);

  kernel.dispatch = function(event) {
    tapSyscall(event); // read-only mirror
    return original(event);
  };

  return kernel;
}

module.exports = { attachKernelTap };
