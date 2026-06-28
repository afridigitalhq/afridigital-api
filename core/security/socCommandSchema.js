export const SOC_COMMAND_TYPES = {
  INCIDENT_CREATE: "INCIDENT_CREATE",
  INCIDENT_REPLAY: "INCIDENT_REPLAY",
  DAG_QUERY: "DAG_QUERY",
  SYSTEM_FORECAST: "SYSTEM_FORECAST",
  PANIC_MODE: "PANIC_MODE",
  ADMIN_ACTION: "ADMIN_ACTION"
};

export function createSOCCommand({ type, payload, user }) {
  return {
    id: crypto.randomUUID(),
    type,
    payload,
    userId: user?.id,
    role: user?.role,
    timestamp: Date.now(),
    signature: null, // filled by auth layer
    status: "PENDING_VERIFICATION"
  };
}
