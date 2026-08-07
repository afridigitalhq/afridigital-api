export class AfriNucExecutionQueue {

  constructor(){
    this.queue=[];
  }

  add(context){

    const item={
      queueId:`queue-${Date.now()}`,
      workspaceId:context.workspaceId,
      jobId:context.jobId,
      executionScope:context.executionScope,
      status:"QUEUED",
      addedAt:new Date().toISOString()
    };

    this.queue.push(item);

    return {
      component:"AfriNuc Execution Queue",
      status:"ADDED",
      item
    };
  }

  next(){

    const item=this.queue.find(
      q=>q.status==="QUEUED"
    );

    if(!item){
      return {
        component:"AfriNuc Execution Queue",
        status:"EMPTY"
      };
    }

    item.status="EXECUTING";

    return {
      component:"AfriNuc Execution Queue",
      status:"DISPATCHED",
      item
    };
  }

  list(){

    return {
      component:"AfriNuc Execution Queue",
      total:this.queue.length,
      queue:this.queue
    };
  }
}
