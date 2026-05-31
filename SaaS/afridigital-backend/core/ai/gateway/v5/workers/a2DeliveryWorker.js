const queue = require("../runtime/queue/a2Queue");
const transport = require("../plugins/whatsapp/cloud/whatsappCloudTransport");

const WORKER_ID = "worker-" + Math.random().toString(36).slice(2, 10);

class A2DeliveryWorkerV3 {
  start() {
    console.log("🧠 A2 WORKER v3 ONLINE:", WORKER_ID);
    this.loop();
  }

  async loop() {
    while (true) {
      const job = queue.claim(WORKER_ID);

      if (!job) {
        await this.sleep(300);
        continue;
      }

      try {
        console.log("⚡ PROCESS:", job.id);

        const message = "[A2-PROD-v3] " + job.text;

        if (job.to && job.to !== "mock") {
          await transport.sendText(job.to, message);
        }

        job.status = "sent";
        job.result = message;
        job.updatedAt = Date.now();

        queue.update(job);

        console.log("📡 SENT:", job.id);

      } catch (err) {
        job.retries += 1;
        job.error = err.message;

        if (job.retries < 3) {
          job.status = "queued";
        } else {
          job.status = "dead";
        }

        queue.update(job);

        console.log("❌ FAILED:", job.id);
      }
    }
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

module.exports = new A2DeliveryWorkerV3();
