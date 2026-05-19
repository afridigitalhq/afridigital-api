const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 📦 AfriOS Job Proof Engine v2.2
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

// 💾 SAVE JOBS
function save(data) {
  fs.writeFileSync(JOB_DB, JSON.stringify(data, null, 2));
}

// 📸 SUBMIT JOB PROOF
function submitJobProof(jobId, worker, proof) {

  const jobs = load();

  const job = jobs.find(j => j.id === jobId);

  if (!job) return "JOB NOT FOUND";

  job.status = "PENDING_REVIEW";

  job.proof = {
    images: proof.images || [],
    notes: proof.notes || "",
    submittedAt: new Date().toISOString()
  };

  job.worker = worker;

  job.reviewDeadline = Date.now() + 24 * 60 * 60 * 1000;
job.autoPayAt = job.reviewDeadline;

  save(jobs);

  return job;
}

// ⏳ AUTO APPROVE CHECK
function autoApprove() {

  const jobs = load();

  const now = Date.now();

  jobs.forEach(job => {

    if (
      job.status === "PENDING_REVIEW" &&
      now > job.reviewDeadline
    ) {
      job.status = "AUTO_APPROVED";
    }
  });

  save(jobs);

  return jobs;
}

module.exports = {
  submitJobProof,
  autoApprove
};
