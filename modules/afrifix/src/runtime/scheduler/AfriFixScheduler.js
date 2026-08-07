export class AfriFixScheduler {
  schedule(job){
    return {
      component:"AfriFix Scheduler",
      status:"SCHEDULED",
      job,
      scheduledAt:new Date().toISOString()
    };
  }
}
