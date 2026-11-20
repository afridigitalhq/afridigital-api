let state = Object.freeze({ status: "NOT_READY", ready: false, checks: Object.freeze({ database: false, identity: false, approval: false, command: false }), timestamp: null });
let postgresPool;
export function markAfriAgentPlatformReady({ postgresPool: pool, afriIdentity, approvalRuntime, commandRuntime, commandStatus } = {}) {
  const checks = { database: typeof pool?.query === "function", identity: typeof afriIdentity?.sessionService?.verifyPrincipal === "function", approval: Boolean(approvalRuntime?.authority && approvalRuntime?.delegationExecutor && approvalRuntime?.commandRuntime === commandRuntime), command: Boolean(commandStatus?.initialized === true && commandStatus.agentId === "AGENT-AFRIAICOMMAND-001" && commandStatus.providerId === "afriaicommand-command-provider" && commandStatus.capability === "afriaicommand.execute" && commandStatus.executionChannel === "INTERNAL_ADMIN" && typeof commandRuntime?.plan === "function" && typeof commandRuntime?.executeApproved === "function") };
  if (Object.values(checks).some(v => !v)) throw new Error("AFRI_AGENT_PLATFORM_READINESS_CHECK_FAILED");
  postgresPool = pool;
  state = Object.freeze({ status: "READY", ready: true, checks: Object.freeze(checks), timestamp: new Date().toISOString() });
  return { ...state, checks: { ...state.checks } };
}
export async function getAfriAgentPlatformReadiness({ timeoutMs = 1500 } = {}) {
  const snapshot = { ...state, checks: { ...state.checks } };
  if (!snapshot.ready) return snapshot;
  const boundedTimeout = Number.isInteger(timeoutMs) && timeoutMs > 0 && timeoutMs <= 10000 ? timeoutMs : 1500;
  let timer;
  try {
    const query = Promise.resolve().then(() => postgresPool.query({ text: "SELECT 1", query_timeout: boundedTimeout }));
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("AFRI_POSTGRES_READINESS_TIMEOUT")), boundedTimeout); });
    await Promise.race([query, timeout]);
    return { ...snapshot, status: "READY", ready: true, checks: { ...snapshot.checks, database: true }, timestamp: new Date().toISOString() };
  } catch {
    return { ...snapshot, status: "NOT_READY", ready: false, checks: { ...snapshot.checks, database: false }, timestamp: new Date().toISOString() };
  } finally {
    if (timer) clearTimeout(timer);
  }
}