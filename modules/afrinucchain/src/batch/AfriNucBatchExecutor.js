import { AfriFixRuntimeServiceGateway } from "../../../afrifix/src/runtime/service/AfriFixRuntimeServiceGateway.js";

export class AfriNucBatchExecutor {
  constructor(){
    this.runtime = new AfriFixRuntimeServiceGateway();
  }

  async execute(batch){
    if(!batch.workspace){
      return {
        component:"AfriNuc Batch Executor",
        status:"BLOCKED",
        batch:batch.id,
        strategy:batch.strategy,
        reason:"Workspace is required for AfriFix execution.",
        completedAt:new Date().toISOString()
      };
    }
    const results=[];

    for(const item of batch.modules){
      const result = await this.runtime.execute({
        module:item.module,
        action:item.action,
        workspace:batch.workspace,
          approvalContext:batch.approvalContext || null,
          approvalRequired:batch.approvalRequired ?? true,
          evidenceRequired:batch.evidenceRequired ?? true
      });

      results.push({
        module:item.module,
        action:item.action,
        runtime:"AfriFix",
        status:result.status,
        result
      });
    }

    const blocked = results.some(item => item.status !== "EXECUTED");

    return {
      component:"AfriNuc Batch Executor",
      status:blocked ? "BLOCKED" : "EXECUTED",
      batch:batch.id,
      strategy:batch.strategy,
      results,
      completedAt:new Date().toISOString()
    };
  }
}
