import Registry from "../investigation/AfriDebugInvestigationRegistry.js";
import Engine from "../execution/AfriDebugExecutionEngine.js";
import Bus from "../events/AfriDebugEventBus.js";

const AfriDebugLiveRuntime = {
  start(job = {}) {
    const stages = Engine.create(Registry.list());

    const investigation = {
      id:`INV-${Date.now()}`,
      source:job.source || "manual",
      project:job.project || null,
      repository:job.repository || null,
      status:"RUNNING",
      stages,
      startedAt:Date.now()
    };

    Bus.emit("investigation.started",{
      id:investigation.id,
      project:investigation.project
    });

    if(stages.length){
      Engine.start(stages[0]);

      Bus.emit("stage.started",{
        investigation:investigation.id,
        stage:stages[0].name
      });
    }

    return investigation;
  }
};

export default AfriDebugLiveRuntime;
