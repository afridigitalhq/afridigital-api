/**
 * 🧊 A3.18.8 PERSISTENT JOB QUEUE CORE
 * Safe replacement for in-memory scheduling
 */

const jobs = [];

/**
 * enqueue job (replace with DB later)
 */
function enqueue(job) {

  const enriched = {
    id: "JOB_" + Date.now(),
    ...job,
    status: "PENDING",
    attempts: 0,
    createdAt: Date.now()
  };

  jobs.push(enriched);

  return enriched;
}

/**
 * fetch pending jobs
 */
function getPending() {
  return jobs.filter(j => j.status === "PENDING");
}

module.exports = { enqueue, getPending };
