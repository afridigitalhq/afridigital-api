const truthKernel = require("./truthKernel");
const truthLock = require("./truthLock");

function runKernel(input) {
  truthLock?.validate?.(input);
  return truthKernel.runKernel
    ? truthKernel.runKernel(input)
    : truthKernel(input);
}

module.exports = { runKernel };
