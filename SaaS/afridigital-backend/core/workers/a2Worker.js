const queue = require("../queue/a2Queue.persist");
const cloud = require("../integrations/whatsapp/cloud");

class A2Worker {
  constructor() {
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;

    console.log("🧠 A2 WORKER v1.3 RESILIENT STARTED");
    this.loop();
  }

  async loop() {
    while (this.running) {
      const job = queue.next();

      if (!job) {
        await this.sleep(500);
        continue;
      }

      try {
        console.log("⚡ PROCESSING:", job.id);

        const reply = this.process(job.text);

        // DELIVERY
        const res = await cloud.sendText(job.to, reply);

        job.status = "sent";
        job.result = reply;
        job.delivery = {
          statusCode: res.status,
          response: res.data
        };

        queue.update(job);

        console.log("📡 SENT:", job.id);

      } catch (e) {
        job.retries += 1;
        job.error = e.message;

        // retry logic
        if (job.retries < 3) {
          job.status = "queued";
          console.log("🔁 RETRY:", job.id, job.retries);
        } else {
          job.status = "failed";
          console.log("❌ DEAD LETTER:", job.id);
        }

        queue.update(job);
      }
    }
  }

  process(text) {
    return "[A2-RESILIENT] " + text;
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

module.exports = new A2Worker();
