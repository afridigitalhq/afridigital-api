function rankJobs(jobs) {
  return jobs.sort((a, b) => (b.budget || 0) - (a.budget || 0));
}

module.exports = { rankJobs };
