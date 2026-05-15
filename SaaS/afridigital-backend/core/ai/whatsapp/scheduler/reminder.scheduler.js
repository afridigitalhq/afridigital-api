/**
 * ⏰ A3.18.7 WHATSAPP REMINDER ENGINE
 * Handles scheduled AI-driven messaging
 */

const { publish } = require("../../../event/bus");
const { createEvent } = require("../../../event/types");

/**
 * In-memory schedule store (upgrade to DB later)
 */
const schedules = [];

/**
 * Create reminder
 */
function createReminder(userId, message, scheduleTime, type = "CHECKIN") {

  const job = {
    id: "JOB_" + Date.now(),
    userId,
    message,
    scheduleTime,
    type,
    status: "PENDING"
  };

  schedules.push(job);

  publish(createEvent("WHATSAPP_SCHEDULE_CREATED", job));

  return job;
}

/**
 * Run scheduler tick (called by cron every minute)
 */
function runScheduler(now = Date.now()) {

  const due = schedules.filter(j =>
    j.status === "PENDING" && j.scheduleTime <= now
  );

  for (const job of due) {

    job.status = "TRIGGERED";

    publish(createEvent("WHATSAPP_SCHEDULE_TRIGGERED", {
      userId: job.userId,
      message: job.message,
      type: job.type,
      jobId: job.id
    }));
  }

  return due.length;
}

function getSchedules() {
  return schedules;
}

module.exports = {
  createReminder,
  runScheduler,
  getSchedules
};
