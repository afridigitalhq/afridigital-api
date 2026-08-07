export class AfriFixExecutionRegistry {
  constructor() {
    this.executions = new Map();
  }

  register(execution = {}) {
    this.executions.set(execution.executionId, execution);
    return {
      component: "AfriFix Execution Registry",
      status: "REGISTERED",
      execution,
      total: this.executions.size,
      timestamp: new Date().toISOString()
    };
  }

  get(executionId) {
    return this.executions.get(executionId);
  }

  list() {
    return Array.from(this.executions.values());
  }

  remove(executionId) {
    this.executions.delete(executionId);
    return {
      component: "AfriFix Execution Registry",
      status: "REMOVED",
      executionId,
      total: this.executions.size,
      timestamp: new Date().toISOString()
    };
  }
}
