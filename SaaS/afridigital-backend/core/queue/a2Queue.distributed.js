const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "queue.store.json");

class DistributedQueue {
  load() {
    try {
      return JSON.parse(fs.readFileSync(FILE, "utf8"));
    } catch {
      return [];
    }
  }

  save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  }

  claim(workerId) {
    const jobs = this.load();

    const job = jobs.find(j => j.status === "queued");
    if (!job) return null;

    job.status = "processing";
    job.worker = workerId;
    job.startedAt = Date.now();

    this.save(jobs);
    return job;
  }

  update(job) {
    const jobs = this.load();
    const idx = jobs.findIndex(j => j.id === job.id);

    if (idx !== -1) {
      jobs[idx] = job;
      this.save(jobs);
    }
  }
}

module.exports = new DistributedQueue();
