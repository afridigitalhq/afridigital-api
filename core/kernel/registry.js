// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const modules = {
  eventSpine: true,
  stateMachine: true,
  governance: true,
  hudBridge: true,

  adapters: {
    whatsapp: true,
    github: true,
    render: true
  }
};

function isEnabled(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], modules);
}

module.exports = { modules, isEnabled };
