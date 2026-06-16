const runControlPlane = require('./control.plane');

module.exports = async function auditV3() {
  const state = await runControlPlane();

  const ok = state && typeof state === "object";

  return {
    ok,
    score: state.score || 0,
    state: state.state || "UNKNOWN",
    infra: state.infra,
    render: state.render,
    verdict: ok ? "STABLE" : "FAIL"
  };
};
