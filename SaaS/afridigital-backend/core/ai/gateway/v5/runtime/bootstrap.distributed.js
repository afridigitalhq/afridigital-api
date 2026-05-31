const Worker = require("./workers/a2.worker");
const queue = require("./queue/a2Queue.core");
const transport = require("./transport/whatsapp.transport");

const worker = new Worker("worker-1");

worker.start(async (job) => {
  console.log("⚡ PROCESS:", job.id);

  const msg = `[A2-DISTRIBUTED] ${job.text}`;

  if (job.to && job.to !== "mock") {
    await transport.sendText(job.to, msg);
  }

  job.result = msg;
});

console.log("🚀 DISTRIBUTED CORE ONLINE");
