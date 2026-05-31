class A2Queue {
  constructor(adapter) {
    this.adapter = adapter || new InMemoryAdapter();
  }

  add(job) {
    return this.adapter.add(job);
  }

  next(workerId) {
    return this.adapter.claim(workerId);
  }

  update(job) {
    return this.adapter.update(job);
  }
}

class InMemoryAdapter {
  constructor() {
    this.jobs = [];
  }

  add(job) {
    const item = {
      id: Date.now().toString(),
      status: "queued",
      retries: 0,
      ...job
    };
    this.jobs.push(item);
    return item;
  }

  claim(workerId) {
    const job = this.jobs.find(j => j.status === "queued");
    if (!job) return null;

    job.status = "processing";
    job.workerId = workerId;
    return job;
  }

  update(job) {
    const idx = this.jobs.findIndex(j => j.id === job.id);
    if (idx !== -1) this.jobs[idx] = job;
  }
}

module.exports = A2Queue;
