const cloud = require('./cloud');

class A2EngineExt {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async enqueue(payload = {}) {
    const job = {
      id: Date.now().toString(),
      text: payload.text || "",
      to: payload.to || "mock-user",
      status: "queued"
    };

    this.queue.push(job);
    this._process();

    return { ok: true, queued: true, id: job.id };
  }

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();

      // streaming simulation
      const words = job.text.split(" ");
      let acc = "";

      for (let i = 0; i < words.length; i++) {
        acc += (i ? " " : "") + words[i];
        console.log("A2 STREAM:", acc);
        await new Promise(r => setTimeout(r, 40));
      }

      // SEND VIA WHATSAPP CLOUD ADAPTER (SAFE)
      await cloud.sendMessage({
        to: job.to,
        text: "[A2] " + job.text
      });

      job.status = "done";
    }

    this.processing = false;
  }
}

module.exports = new A2EngineExt();


// AUTO_DISPATCH (safe runtime hook)
const worker = require('../../workers/a2DeliveryWorker');

const originalEnqueue = module.exports.enqueue;

module.exports.enqueue = async function(payload) {
  const job = await originalEnqueue.call(this, payload);

  try {
    const q = this.queue[this.queue.length - 1];
    if (q) worker.send(q);
  } catch (e) {
    console.log('AUTO_DISPATCH ERROR:', e.message);
  }

  return job;
};
