import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";

export class AfriFixWorker {
  constructor(){
    this.events=new AfriFixRuntimeEventStore();
  }

  execute(job={}){
    const stages=job.stages||["Execute"];

    const result={
      component:"AfriFix Worker",
      status:"EXECUTED",
      job,
      stagesExecuted:stages.map((stage,index)=>({
        order:index+1,
        stage,
        status:"COMPLETED",
        completedAt:new Date().toISOString()
      })),
      completedAt:new Date().toISOString()
    };

    this.events.publish("JOB_EXECUTED",{
      ...job,
      status:result.status,
      stagesExecuted:result.stagesExecuted
    });

    return result;
  }
}
