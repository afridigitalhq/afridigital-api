const queue = require("../queue/a2Queue.distributed");
const cloud = require("../integrations/whatsapp/cloud");

const WORKER_ID = "worker-" + Math.random().toString(36).slice(2,8);

class DistributedWorker {
  start() {
    console.log("🧠 DISTRIBUTED WORKER STARTED:", WORKER_ID);
    this.loop();
  }

  async loop() {
    while (true) {
      const job = queue.claim(WORKER_ID);

      if (!job) {
        await this.sleep(400);
        continue;
      }

      try {
        console.log("⚡", WORKER_ID, "processing", job.id);

        const reply = "[A2-DISTRIBUTED] " + job.text;

        const res = await require("../plugins/whatsapp/cloud/whatsappCloudAdapter").sendText(job.to, reply);

        job.status = "sent";
        job.result = reply;
        job.delivery = res;

        queue.update(job);

        console.log("📡 SENT:", job.id);

      } catch (e) {
        job.status = "failed";
        job.error = e.message;
        queue.update(job);

        console.log("❌ FAILED:", job.id);
      }
    }
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

module.exports = new DistributedWorker();
