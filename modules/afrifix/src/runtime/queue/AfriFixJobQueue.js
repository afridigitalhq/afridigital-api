export class AfriFixJobQueue {
  constructor(){ this.jobs=[]; }
  enqueue(job={}){ const item={id:`job-${Date.now()}`,status:"QUEUED",createdAt:new Date().toISOString(),...job}; this.jobs.push(item); return item; }
  dequeue(){ return this.jobs.shift(); }
  list(){ return this.jobs; }
}
