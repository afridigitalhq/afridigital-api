const CoreDelegationPlanner = {
  plan(request = {}) {
    const capability = request.capability || request.target || null;

    return {
      id: request.id || `DELEGATION-${Date.now()}`,
      capability,
      task: request.task || request.payload || {},
      context: request.context || {},
      status: capability ? "PLANNED" : "REJECTED",
      createdAt: new Date().toISOString()
    };
  }
};

export default CoreDelegationPlanner;
