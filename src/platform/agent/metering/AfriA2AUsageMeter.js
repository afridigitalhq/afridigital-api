const usage = [];

const AfriA2AUsageMeter = {

  start(input = {}) {
    return this.record({
      ...input,
      status: "PROCESSING",
      startedAt: input.startedAt || Date.now(),
      completedAt: null,
      durationMs: null
    });
  },

  record(input = {}) {
    const now = Date.now();

    const record = {
      id:
        input.id ||
        `USAGE-${now}-${Math.random().toString(36).slice(2,8)}`,

      taskId: input.taskId || null,

      sourceAgentId:
        input.sourceAgentId || null,

      targetAgentId:
        input.targetAgentId ||
        input.agentId ||
        null,

      agentId:
        input.agentId ||
        input.targetAgentId ||
        null,

      capability:
        input.capability || null,

      status:
        input.status || "COMPLETED",

      units:
        Number(input.units || 1),

      cost:
        Number(input.cost || 0),

      currency:
        input.currency || "USD",

      startedAt:
        input.startedAt || now,

      completedAt:
        input.completedAt ??
        (input.status === "PROCESSING" ? null : now),

      durationMs:
        input.durationMs ??
        (
          input.startedAt &&
          input.status !== "PROCESSING"
            ? Math.max(0, now - input.startedAt)
            : null
        ),

      errorCode:
        input.errorCode || null,

      errorMessage:
        input.errorMessage || null,

      recordedAt:
        input.recordedAt || now
    };

    usage.push(record);

    return record;
  },

  update(id, patch = {}) {
    const record = usage.find(
      item => item.id === id
    );

    if (!record) return null;

    Object.assign(record, patch);

    if (
      record.status !== "PROCESSING" &&
      !record.completedAt
    ) {
      record.completedAt = Date.now();
    }

    if (
      record.completedAt &&
      record.startedAt
    ) {
      record.durationMs =
        Math.max(
          0,
          record.completedAt - record.startedAt
        );
    }

    return record;
  },

  list() {
    return [...usage].sort(
      (a, b) => b.recordedAt - a.recordedAt
    );
  },

  stats(agentId = null) {

    const records = agentId
      ? usage.filter(
          item =>
            item.sourceAgentId === agentId ||
            item.targetAgentId === agentId ||
            item.agentId === agentId
        )
      : usage;

    const incoming = agentId
      ? records.filter(
          item =>
            item.targetAgentId === agentId &&
            item.sourceAgentId &&
            item.sourceAgentId !== agentId
        ).length
      : 0;

    const outgoing = agentId
      ? records.filter(
          item =>
            item.sourceAgentId === agentId &&
            item.targetAgentId &&
            item.targetAgentId !== agentId
        ).length
      : 0;

    const contacts = agentId
      ? new Set(
          records.flatMap(item => {

            const peers = [];

            if (
              item.sourceAgentId === agentId &&
              item.targetAgentId &&
              item.targetAgentId !== agentId
            ) {
              peers.push(item.targetAgentId);
            }

            if (
              item.targetAgentId === agentId &&
              item.sourceAgentId &&
              item.sourceAgentId !== agentId
            ) {
              peers.push(item.sourceAgentId);
            }

            return peers;
          })
        ).size
      : 0;

    return {
      operations: records.length,

      a2aCalls:
        records.length,

      agentContacts:
        contacts,

      incoming,

      outgoing,

      processing:
        records.filter(
          item => item.status === "PROCESSING"
        ).length,

      completed:
        records.filter(
          item => item.status === "COMPLETED"
        ).length,

      failed:
        records.filter(
          item => item.status === "FAILED"
        ).length,

      successful:
        records.filter(
          item => item.status === "COMPLETED"
        ).length,

      units:
        records.reduce(
          (sum, item) => sum + item.units,
          0
        ),

      cost:
        records.reduce(
          (sum, item) => sum + item.cost,
          0
        )
    };
  }

};

export default AfriA2AUsageMeter;
