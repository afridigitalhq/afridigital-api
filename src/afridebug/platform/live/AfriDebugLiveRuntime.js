import Registry from "../investigation/AfriDebugInvestigationRegistry.js";
import Engine from "../execution/AfriDebugExecutionEngine.js";
import Bus from "../events/AfriDebugEventBus.js";

const AfriDebugLiveRuntime = {

  start(job = {}){

    const stages =
      Engine.create(
        Registry.list()
      );


    const investigation = {

      id:`INV-${Date.now()}`,

      source:
        job.source || "manual",

      project:
        job.project || null,

      repository:
        job.repository || null,

      status:"RUNNING",

      stages,

      startedAt:
        Date.now()

    };


    Bus.publish({

      type:"investigation.started",

      investigationId:
        investigation.id

    });


    if(stages.length){

      Engine.start(
        stages[0]
      );


      Bus.publish({

        type:"stage.started",

        investigationId:
          investigation.id,

        stage:
          stages[0].name

      });

    }


    return investigation;

  },


  completeStage(
    investigation,
    stageId
  ){

    const stage =
      investigation.stages.find(
        item=>item.id===stageId
      );


    if(!stage)
      return null;


    Engine.complete(stage);


    Bus.publish({

      type:"stage.completed",

      investigationId:
        investigation.id,

      stage:
        stage.name

    });


    const next =
      investigation.stages.find(
        item=>item.state==="QUEUED"
      );


    if(next){

      Engine.start(next);


      Bus.publish({

        type:"stage.started",

        investigationId:
          investigation.id,

        stage:
          next.name

      });

    }
    else{

      investigation.status="COMPLETED";


      Bus.publish({

        type:"execution.completed",

        investigationId:
          investigation.id

      });

    }


    return investigation;

  },


  failStage(
    investigation,
    stageId,
    reason="UNKNOWN"
  ){

    const stage =
      investigation.stages.find(
        item=>item.id===stageId
      );


    if(!stage)
      return null;


    Engine.fail(
      stage,
      reason
    );


    investigation.status="FAILED";


    Bus.publish({

      type:"stage.failed",

      investigationId:
        investigation.id,

      stage:
        stage.name,

      reason

    });


    return investigation;

  }

};


export default AfriDebugLiveRuntime;
