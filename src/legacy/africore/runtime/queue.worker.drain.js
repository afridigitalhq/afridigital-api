const queue = require("./message.queue");
const http = require("./http.client");

async function startQueueDrain() {
  setInterval(async () => {
    const job = queue.dequeue();
    if (!job) return;

    try {
      await http.post(job.url, {
        headers: {
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`
        },
        body: job.payload
      });

      console.log("♻️ Queue drained message sent");
    } catch (e) {
      console.log("❌ Queue retry failed:", e.message);
      queue.enqueue(job); // requeue
    }
  }, 3000);
}

module.exports = { startQueueDrain };
