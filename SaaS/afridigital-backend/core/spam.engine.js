const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚫 AfriOS Spam Job Detector v2.6
 */

const fs = require('fs');

const JOB_DB = './storage/jobs.json';

// 📦 LOAD JOBS
function load() {
  try {
    return JSON.parse(fs.readFileSync(JOB_DB));
  } catch {
    return [];
  }
}

// 🚨 DETECT SPAM JOBS
function analyzeJob(job) {

  let risk = 0;

  // ❌ too cheap job spam
  if (job.amount < 10) risk += 30;

  // ❌ empty description
  if (!job.description || job.description.length < 10) risk += 25;

  // ❌ repeated title patterns
  const jobs = load();
  const duplicates = jobs.filter(j => j.title === job.title);

  if (duplicates.length > 3) risk += 40;

  return {
    jobId: job.id,
    riskScore: Math.min(100, risk),
    status:
      risk > 70
        ? "SPAM_BLOCKED"
        : risk > 40
        ? "SUSPICIOUS"
        : "CLEAN"
  };
}

module.exports = {
  analyzeJob
};
