const engine = require('../plugins/whatsapp/a2Engine.ext');
const worker = require('../workers/a2DeliveryWorker');

class A2QueueDrainer {
  constructor() {
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;

    console.log('🧠 A2 DRAINER STARTED');

    setInterval(async () => {
      try {
        const queue = engine.queue || [];

        if (!queue.length) return;

        const job = queue.shift();

        if (!job) return;

        console.log('⚙️ DRAINING JOB:', job.id);

        await worker.send(job);

        job.status = 'done';

      } catch (e) {
        console.log('❌ DRAIN ERROR:', e.message);
      }
    }, 500); // fast micro-drain loop
  }
}

module.exports = new A2QueueDrainer();
