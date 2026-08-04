const queue = [];

const AfriDebugQueue = {

  push(item = {}){

    const job = {
      id:`QUEUE-${Date.now()}`,
      ...item,
      createdAt:Date.now()
    };

    queue.push(job);

    return job;

  },


  stats(){

    return {

      total:queue.length,

      pending:queue.filter(
        item => item.status !== "completed"
      ).length,

      completed:queue.filter(
        item => item.status === "completed"
      ).length

    };

  },


  list(){

    return queue;

  }

};

export default AfriDebugQueue;
