// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { kernelGate } = require("./gate/kernel.gate");

function fromWhatsApp(message, user) {
  return kernelGate({
    type: "WHATSAPP_EVENT",
    payload: message,
    user
  }, { source: "whatsapp" });
}

function fromGitHub(pr) {
  return kernelGate({
    type: "GITHUB_PR_EVENT",
    payload: pr
  }, { source: "github" });
}

function fromCI(ciEvent) {
  return kernelGate({
    type: "CI_EVENT",
    payload: ciEvent
  }, { source: "ci" });
}

module.exports = { fromWhatsApp, fromGitHub, fromCI };
