class A2Queue {
  constructor() {
    this.jobs = [];
    this.processing = false;
  }

  add(job) {
    const item = {
      id: Date.now().toString(),
      ...job,
      status: "queued"
    };

    this.jobs.push(item);
    return item;
  }

  next() {
    return this.jobs.shift();
  }

  size() {
    return this.jobs.length;
  }
}

module.exports = new A2Queue();
