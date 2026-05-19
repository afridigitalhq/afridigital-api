const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🔔 AfriAI Job Notification Service v2.2
 */

const sendWhatsAppMessage = require('./whatsapp.send');

// 👇 NOTIFY EMPLOYER
async function notifyEmployer(job, employer) {

  const message = `
📦 AfriAI Job Update

Your job has been completed.

🧑 Worker submitted proof of work:
📸 Images attached
📝 Notes: ${job.proof?.notes || "None"}

⏳ Status: Pending your review

👉 Approve or Reject within 24 hours
Otherwise system will auto-release payment.
`;

  await sendWhatsAppMessage(employer, message);
}

// 👇 NOTIFY WORKER
async function notifyWorker(job, worker) {

  const message = `
✅ AfriAI Confirmation

Your job submission has been received.

📦 Status: Pending employer review
⏳ Auto approval in 24 hours if no response

Stay active 💼
`;

  await sendWhatsAppMessage(worker, message);
}

module.exports = {
  notifyEmployer,
  notifyWorker
};
