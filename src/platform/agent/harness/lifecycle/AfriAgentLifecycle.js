const TRANSITIONS = Object.freeze({
  PENDING: Object.freeze(["ACTIVE", "SUSPENDED", "REVOKED"]),
  ACTIVE: Object.freeze(["SUSPENDED", "REVOKED"]),
  SUSPENDED: Object.freeze(["ACTIVE", "REVOKED"]),
  REVOKED: Object.freeze([])
});

const AfriAgentLifecycle = {
  canTransition(currentStatus, nextStatus) {
    return TRANSITIONS[currentStatus]?.includes(nextStatus) === true;
  },

  transition(agent, nextStatus) {
    if (!agent || typeof agent !== "object") {
      throw new Error("AFRI_AGENT_LIFECYCLE_AGENT_REQUIRED");
    }

    if (!Object.hasOwn(TRANSITIONS, nextStatus)) {
      throw new Error("AFRI_AGENT_LIFECYCLE_STATUS_INVALID");
    }

    if (!this.canTransition(agent.status, nextStatus)) {
      throw new Error("AFRI_AGENT_LIFECYCLE_TRANSITION_FORBIDDEN");
    }

    return {
      ...agent,
      status: nextStatus,
      statusChangedAt: Date.now()
    };
  },

  statuses() {
    return Object.keys(TRANSITIONS);
  }
};

export default AfriAgentLifecycle;
