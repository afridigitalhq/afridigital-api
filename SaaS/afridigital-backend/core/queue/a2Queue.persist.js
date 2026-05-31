const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "queue.store.json");

class PersistentQueue {
  constructor() {
    this.jobs = this.load();
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(FILE, "utf8"));
    } catch {
      return [];
    }
  }

  save() {
    fs.writeFileSync(FILE, JSON.stringify(this.jobs, null, 2));
  }

  add(job) {
    const item = {
      id: Date.now().toString(),
      status: "queued",
      retries: 0,
      ...job
    };

    this.jobs.push(item);
    this.save();
    return item;
  }

  next() {
    const job = this.jobs.find(j => j.status === "queued");
    if (!job) return null;

    job.status = "processing";
    this.save();

    return job;
  }

  update(job) {
    const idx = this.jobs.findIndex(j => j.id === job.id);
    if (idx !== -1) {
      this.jobs[idx] = job;
      this.save();
    }
  }

  size() {
    return this.jobs.filter(j => j.status === "queued").length;
  }
}

module.exports = new PersistentQueue();
