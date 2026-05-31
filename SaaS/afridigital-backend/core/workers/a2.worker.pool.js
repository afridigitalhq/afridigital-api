const crypto = require("crypto");

class A2WorkerPool {
  constructor(queue, transport) {
    this.queue = queue;
    this.transport = transport;
  }

  start() {
    const workerId = crypto.randomUUID();

    console.log("🧠 WORKER ONLINE:", workerId);

    this.loop(workerId);
  }

  async loop(workerId) {
    while (true) {
      const job = this.queue.next(workerId);

      if (!job) {
        await this.sleep(300);
        continue;
      }

      try {
        console.log("⚡ JOB:", job.id);

        const result = await this.process(job);

        job.status = "done";
        job.result = result;

        if (job.to && job.to !== "mock") {
          await this.transport.send(job.to, result);
        }

        this.queue.update(job);

      } catch (e) {
        job.retries += 1;
        job.error = e.message;

        if (job.retries < 3) {
          job.status = "queued";
        } else {
          job.status = "failed";
        }

        this.queue.update(job);
      }
    }
  }

  process(job) {
    return "[A2-PROD-v2] " + job.text;
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

module.exports = A2WorkerPool;
