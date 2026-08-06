const usage = [];

const AfriDebugUsageMeter = {

  record(event = {}) {
    const item = {
      id:`USAGE-${Date.now()}`,
      developer:event.developer || null,
      project:event.project || null,
      operation:event.operation || "debug-run",
      credits:event.credits || 1,
      createdAt:Date.now()
    };

    usage.push(item);

    return item;
  },

  history() {
    return usage;
  },

  totalCredits() {
    return usage.reduce(
      (sum,item)=>sum + item.credits,
      0
    );
  },

  stats() {
    return {
      events:usage.length,
      credits:this.totalCredits()
    };
  }

};

export default AfriDebugUsageMeter;
