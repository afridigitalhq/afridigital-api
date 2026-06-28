// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const registeredAdapters = new Set([
  "whatsapp",
  "github",
  "ci",
  "hud"
]);

function assertAdapter(source) {
  if (!registeredAdapters.has(source)) {
    throw new Error("SPRAWL_GUARD: Unregistered adapter blocked -> " + source);
  }
}

module.exports = { assertAdapter };
