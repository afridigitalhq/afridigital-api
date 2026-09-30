const usage = [];

const AfriA2AUsageMeter = {

  record(input = {}) {

    const record = {
      id: `USAGE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      taskId: input.taskId || null,
      agentId: input.agentId || null,
      capability: input.capability || null,
      status: input.status || "COMPLETED",
      units: Number(input.units || 1),
      cost: Number(input.cost || 0),
      currency: input.currency || "USD",
      recordedAt: Date.now()
    };

    usage.push(record);

    return record;
  },

  list() {
    return [...usage];
  },

  stats() {
    return {
      tasks: usage.length,
      units: usage.reduce((sum, item) => sum + item.units, 0),
      cost: usage.reduce((sum, item) => sum + item.cost, 0)
    };
  }

};

export default AfriA2AUsageMeter;
