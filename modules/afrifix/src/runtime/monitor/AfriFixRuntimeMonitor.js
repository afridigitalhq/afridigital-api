export class AfriFixRuntimeMonitor {
  inspect(runtime = {}) {
    const stages =
      runtime?.executed?.stagesExecuted ||
      runtime?.stagesExecuted ||
      [];

    const completed = stages.filter(s => s.status === "COMPLETED").length;
    const total = stages.length;

    const healthy = [
      "PASSED",
      "EXECUTED",
      "COMPLETED"
    ].includes(runtime?.status);

    return {
      component: "AfriFix Runtime Monitor",
      status: healthy ? "HEALTHY" : "DEGRADED",
      executionStatus: runtime?.status || "UNKNOWN",
      monitoredAt: new Date().toISOString(),
      metrics: {
        queue: "READY",
        scheduler: "READY",
        worker: healthy ? "READY" : "FAILED",
        dispatcher: healthy ? "READY" : "FAILED",
        stagesCompleted: completed,
        totalStages: total,
        completionRate: total
          ? `${Math.round((completed / total) * 100)}%`
          : "0%"
      }
    };
  }
}
