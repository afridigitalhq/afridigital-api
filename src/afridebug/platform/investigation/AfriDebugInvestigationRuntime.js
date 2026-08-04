import Registry from "./AfriDebugInvestigationRegistry.js";

const AfriDebugInvestigationRuntime = {
  run(job = {}) {
    const startedAt = Date.now();

    const execution = Registry.list().map((stage, index) => ({
      stage,
      order: index + 1,
      status: "PENDING"
    }));

    return {
      id: `INV-${startedAt}`,
      status: "READY",
      source: job.source || "manual",
      project: job.project || null,
      repository: job.repository || null,
      stages: execution,
      totalStages: execution.length,
      startedAt
    };
  },

  health() {
    return {
      service: "AfriDebugInvestigationRuntime",
      status: "healthy",
      registeredStages: Registry.count()
    };
  }
};

export default AfriDebugInvestigationRuntime;
