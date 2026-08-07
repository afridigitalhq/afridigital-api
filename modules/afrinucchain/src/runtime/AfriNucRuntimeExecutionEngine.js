import {AfriNucPipelineDispatcherV2} from "./AfriNucPipelineDispatcherV2.js";
import {AfriNucExecutionTelemetryStream} from "./AfriNucExecutionTelemetryStream.js";
import {AfriNucExecutionEvidenceBridge} from "./AfriNucExecutionEvidenceBridge.js";
import {AfriNucExecutionAuditVerificationBridge} from "./AfriNucExecutionAuditVerificationBridge.js";

export class AfriNucRuntimeExecutionEngine {

  constructor(){

    this.component="AfriNuc Runtime Execution Engine";
    this.dispatcher=new AfriNucPipelineDispatcherV2();
    this.telemetry=new AfriNucExecutionTelemetryStream();
    this.evidence=new AfriNucExecutionEvidenceBridge();
    this.auditVerification=new AfriNucExecutionAuditVerificationBridge();
    this.executions=[];

  }

  execute(capability,payload={}){

    const dispatch=this.dispatcher.dispatch(
      capability,
      payload
    );

    const execution={
      executionId:`execution-${Date.now()}`,
      component:this.component,
      capability,
      handler:dispatch.handler,
      payload,
      status:"EXECUTED",
      executedAt:new Date().toISOString()
    };

    this.executions.push(execution);

    const telemetry=this.telemetry.record({
      executionId:execution.executionId,
      capability,
      handler:dispatch.handler,
      jobId:payload.jobId,
      status:execution.status
    });

    const evidence=this.evidence.generate({
      executionId:execution.executionId,
      telemetryId:telemetry.event.telemetryId,
      jobId:payload.jobId,
      status:execution.status
    });

const auditVerification=this.auditVerification.verify({
      executionId:execution.executionId,
      telemetryId:telemetry.event.telemetryId,
      evidenceId:evidence.evidence.evidenceId,
      jobId:payload.jobId
    });

    return {
      component:this.component,
      status:"COMPLETED",
      dispatch,
      execution,
      telemetry,
      evidence,
      auditVerification
    };

  }

  list(){

    return {
      component:this.component,
      status:"ACTIVE",
      executions:this.executions,
      totalExecutions:this.executions.length
    };

  }

  health(){

    return {
      component:this.component,
      status:"READY",
      healthy:true,
      checkedAt:new Date().toISOString()
    };

  }

}
