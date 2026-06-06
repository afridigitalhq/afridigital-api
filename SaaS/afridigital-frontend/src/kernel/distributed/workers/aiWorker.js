export const aiWorker = {
  init() {},

  async execute(job) {
    return {
      jobId: job.id,
      status: "completed",
      result: `processed:${job.type}`
    };
  }
};
