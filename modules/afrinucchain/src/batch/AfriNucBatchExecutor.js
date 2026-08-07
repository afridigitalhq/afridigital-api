import { AfriFixRuntimeServiceGateway } from "../runtime/AfriFixRuntimeServiceGateway.js";

export class AfriNucBatchExecutor {
  constructor(){
    this.runtime = new AfriFixRuntimeServiceGateway();
  }

  async execute(batch){
    const results=[];

    for(const item of batch.modules){
      const result = await this.runtime.execute({
        module:item.module,
        action:item.action,
        workspace:"workspace-001"
      });

      results.push({
        module:item.module,
        action:item.action,
        runtime:"AfriFix",
        status:result.status,
        result
      });
    }

    return {
      component:"AfriNuc Batch Executor",
      status:"EXECUTED",
      batch:batch.id,
      strategy:batch.strategy,
      results,
      completedAt:new Date().toISOString()
    };
  }
}
