import State from "./AfriDebugExecutionState.js";

const AfriDebugExecutionEngine = {
  create(stages = []) {
    return stages.map((stage, index) => ({
      id: `STAGE-${index + 1}`,
      name: stage,
      order: index + 1,
      state: State.initial(),
      startedAt: null,
      completedAt: null
    }));
  },

  start(stage) {
    stage.state = "RUNNING";
    stage.startedAt = Date.now();
    return stage;
  },

  complete(stage) {
    stage.state = "COMPLETED";
    stage.completedAt = Date.now();
    return stage;
  },

  fail(stage, reason = "UNKNOWN") {
    stage.state = "FAILED";
    stage.reason = reason;
    stage.completedAt = Date.now();
    return stage;
  }
};

export default AfriDebugExecutionEngine;
