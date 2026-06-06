const allowedEvents = new Set([
  "SYSTEM_BOOT",
  "WINDOW_OPEN",
  "WINDOW_CLOSE",
  "AGENT_EXECUTE_TASK",
  "LLM_RESPONSE"
]);

export const eventRegistry = {
  validate(event) {
    if (!allowedEvents.has(event)) {
      console.warn("❌ UNKNOWN EVENT BLOCKED:", event);
      return false;
    }
    return true;
  }
};
