export const PAYMENTS_ENABLED = false;

export function assertPaymentsEnabled(operation) {
  if (PAYMENTS_ENABLED) return;

  const error = new Error(`AfriAgents Economy payment operation disabled by policy: ${operation}`);
  error.code = "AFRI_ECONOMY_PAYMENTS_DISABLED";
  throw error;
}
