
class WhatsAppDeliveryV2 {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  enqueue(payload) {
    this.queue.push({
      id: Date.now().toString(),
      ...payload,
      status: "queued"
    });

    this.run();
    return { ok: true, queued: true };
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length) {
      const job = this.queue.shift();
      job.status = "processing";

      const text = job.text || "";
      const words = text.split(" ");

      let acc = "";

      for (let i = 0; i < words.length; i++) {
        acc += (i === 0 ? "" : " ") + words[i];

        console.log("📡 V2 WHATSAPP STREAM:", {
          id: job.id,
          type: i === words.length - 1 ? "final" : "chunk",
          text: acc
        });

        await new Promise(r => setTimeout(r, 40));
      }

      job.status = "delivered";
    }

    this.running = false;
  }
}

module.exports = new WhatsAppDeliveryV2();
