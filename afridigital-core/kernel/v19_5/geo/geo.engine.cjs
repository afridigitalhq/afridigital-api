function mapJob(job) {
  if (!job.location) return job;

  return {
    ...job,
    geoCluster: job.location.toLowerCase().includes("lagos")
      ? "LAGOS_CLUSTER"
      : "GLOBAL_CLUSTER"
  };
}

module.exports = { mapJob };
