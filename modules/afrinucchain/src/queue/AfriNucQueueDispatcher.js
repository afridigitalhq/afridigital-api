export class AfriNucQueueDispatcher {

  constructor(queuePersistence,worker){
    this.persistence = queuePersistence;
    this.worker = worker;
  }

  async dispatch(){

    const queue = this.persistence.load();

    const item = queue.find(
      q=>q.status==="EXECUTING" || q.status==="QUEUED"
    );

    if(!item){
      return {
        component:"AfriNuc Queue Dispatcher",
        status:"EMPTY"
      };
    }

    const result =
      await this.worker.process(item);

    item.status="COMPLETED";
    item.completedAt=new Date().toISOString();

    this.persistence.save(queue);

    return {
      component:"AfriNuc Queue Dispatcher",
      status:"DISPATCHED",
      item,
      result
    };
  }
}
