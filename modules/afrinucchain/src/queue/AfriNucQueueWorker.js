export class AfriNucQueueWorker {

  constructor(orchestrator){
    this.orchestrator = orchestrator;
  }

  async process(queueItem){

    if(queueItem.status !== "EXECUTING"){
      return {
        component:"AfriNuc Queue Worker",
        status:"SKIPPED",
        reason:"Queue item not ready"
      };
    }

    const result =
      await this.orchestrator.run({
        jobId:queueItem.jobId,
        status:"CREATED"
      });

    return {
      component:"AfriNuc Queue Worker",
      status:"COMPLETED",
      queueId:queueItem.queueId,
      jobId:queueItem.jobId,
      execution:result,
      completedAt:new Date().toISOString()
    };
  }
}
