class A2Engine {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async enqueue(payload = {}) {
    const job = {
      id: Date.now().toString(),
      text: payload.text || "",
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

      const words = job.text.split(" ");
      let acc = "";

      for (let i = 0; i < words.length; i++) {
        acc += (i ? " " : "") + words[i];
        console.log("A2 STREAM:", acc);
        await new Promise(r => setTimeout(r, 50));
      }

      job.status = "done";
    }

    this.processing = false;
  }
}

module.exports = new A2Engine();
