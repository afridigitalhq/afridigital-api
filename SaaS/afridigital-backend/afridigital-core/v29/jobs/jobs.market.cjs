const jobs = [];

function createJob(job) {
  jobs.push(job);
}

function listJobs() {
  return jobs;
}

module.exports = {
  createJob,
  listJobs
};
