import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";

export class AfriFixJobQueue {
  constructor(){
    this.jobs=[];
    this.events=new AfriFixRuntimeEventStore();
  }

  enqueue(job={}){
    const item={
      id:`job-${Date.now()}`,
      status:"QUEUED",
      createdAt:new Date().toISOString(),
      ...job
    };

    this.jobs.push(item);
    this.events.publish("JOB_QUEUED",item);
    return item;
  }

  dequeue(){ return this.jobs.shift(); }
  list(){ return this.jobs; }
}
