import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";

export class AfriFixRuntimeMonitor {
  constructor(){
    this.events=new AfriFixRuntimeEventStore();
  }

  inspect(runtime={}){
    const stages=
      runtime?.executed?.stagesExecuted ||
      runtime?.stagesExecuted ||
      [];

    const completed=stages.filter(stage=>stage.status==="COMPLETED").length;
    const total=stages.length;

    const healthy=[
      "PASSED",
      "EXECUTED",
      "COMPLETED"
    ].includes(runtime?.status);

    const result={
      component:"AfriFix Runtime Monitor",
      status:healthy?"HEALTHY":"DEGRADED",
      executionStatus:runtime?.status||"UNKNOWN",
      monitoredAt:new Date().toISOString(),
      metrics:{
        queue:"READY",
        scheduler:"READY",
        worker:healthy?"READY":"FAILED",
        dispatcher:healthy?"READY":"FAILED",
        stagesCompleted:completed,
        totalStages:total,
        completionRate:total
          ? `${Math.round((completed/total)*100)}%`
          : "0%"
      }
    };

    if(healthy){
      this.events.publish("VERIFICATION_COMPLETED",{
        executionId:runtime?.job?.executionId||runtime?.executionId||null,
        module:runtime?.job?.module||null,
        action:runtime?.job?.action||null,
        metrics:result.metrics
      });
    }

    return result;
  }
}
