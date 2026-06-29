const fs=require("fs");

const target="core/kernel/gate/kernel.gate.js";

const source=`// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

function kernelGate(event, context = {}) {
  if (!event || !event.type) {
    throw new Error("INVALID_EVENT");
  }

  return {
    ...event,
    source: context.source || "unknown",
    authorized: true
  };
}

module.exports = { kernelGate };
`;

fs.writeFileSync(target,source);

console.log("✅ Rebuilt",target);
