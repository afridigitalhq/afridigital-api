const queue = require("../queue/a2Queue.core");

class A2Worker {
  constructor(id) {
    this.id = id;
    this.running = false;
  }

  async start(handler) {
    this.running = true;
    console.log("🧠 WORKER ONLINE:", this.id);

    while (this.running) {
      const job = await queue.consume(this.id);

      if (!job) {
        await new Promise(r => setTimeout(r, 500));
        continue;
      }

      try {
        await handler(job);

        job.status = "done";
        await queue.ack(job);

        console.log("📡 DONE:", job.id);
      } catch (e) {
        job.status = "failed";
        job.error = e.message;

        await queue.ack(job);

        console.log("❌ FAIL:", job.id);
      }
    }
  }

  stop() {
    this.running = false;
  }
}

module.exports = A2Worker;
