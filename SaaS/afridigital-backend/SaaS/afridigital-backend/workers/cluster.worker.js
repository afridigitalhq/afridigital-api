const metrics = require('../core/observability/metrics');
const logger = require('../core/observability/logger');
const { runSafe } = require('./safe.worker.wrapper');
const dedupe = require('../core/bus/dedupe.engine');
const retry = require('./retry.scheduler');
const dead = require('../storage/queue/dead.letter');
const bus = require('../core/bus/event.bus');
const { generateReply } = require('../core/ai/reply.engine');
const sendMessage = require('../core/whatsapp/sendMessage');

const run = async () => {
  const jobs = bus.consume();

  for (const job of jobs) {

      await runSafe(job, async (job) => {
    try {
      const payload = job.event;

      const messages =
        payload.entry?.[0]?.changes?.[0]?.value?.messages || [];

      for (const msg of messages) {
        const from = msg.from;
        const text = msg.text?.body || "";

        logger.log("AI_INPUT", text);
metrics.inc("processed");
console.log("🧠 AI INPUT:", text);

        const reply = await generateReply(text, from);

        console.log("🤖 AI OUTPUT:", reply);

        await sendMessage(from, reply);
      }

      bus.commit(job.id);
      });
      console.log("✅ EVENT COMMITTED:", job.id);

    } catch (err) {
      console.error("❌ EVENT FAILED:", err.message);
    }
  }
};

setInterval(run, 2500);

module.exports = run;
