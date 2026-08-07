import {AfriNucExecutionTelemetryPersistence} from "./AfriNucExecutionTelemetryPersistence.js";

export class AfriNucExecutionTelemetryStream {

  constructor(){

    this.component="AfriNuc Execution Telemetry Stream";
    this.events=[];
    this.persistence=new AfriNucExecutionTelemetryPersistence();

  }

  record({executionId,capability,handler,jobId,status="EXECUTED"}){

    const event={
      telemetryId:`telemetry-${Date.now()}`,
      component:this.component,
      executionId,
      capability,
      handler,
      jobId,
      status,
      createdAt:new Date().toISOString()
    };

    this.events.push(event);

    const persisted=this.persistence.save(event);

    return {
      component:this.component,
      status:"RECORDED_AND_PERSISTED",
      event,
      persisted
    };

  }

  list(){

    return {
      component:this.component,
      status:"ACTIVE",
      totalEvents:this.events.length,
      events:this.events
    };

  }

}
