class DeliveryEngine {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(job) {
    this.queue.push({
      id: Date.now().toString(),
      ...job,
      status: "queued"
    });

    this.process();
    return { ok: true, queued: true };
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      job.status = "processing";

      try {
        console.log("📨 PROCESSING WHATSAPP JOB:", job.id);

        // simulate kernel call
        const reply = `[A2-SAFE] ${job.text}`;

        // simulate streaming chunks (safe mode)
        const words = reply.split(" ");
        let acc = "";

        for (let i = 0; i < words.length; i++) {
          acc += (i === 0 ? "" : " ") + words[i];

          console.log("📤 STREAM:", {
            id: job.id,
            chunk: acc,
            final: i === words.length - 1
          });
        }

        job.status = "done";
        job.reply = reply;

      } catch (e) {
        console.error("❌ DELIVERY ERROR:", e);
        job.status = "failed";
      }
    }

    this.processing = false;
  }
}

module.exports = new DeliveryEngine();
