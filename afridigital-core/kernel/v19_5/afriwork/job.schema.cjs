function createJob(job) {
  return {
    id: Date.now(),
    title: job.title,
    description: job.description,
    type: job.type, // gig | ad | freelance | promo
    budget: job.budget || 0,
    location: job.location || "global",
    status: "pending_review",
    owner: job.owner,
    createdAt: new Date().toISOString()
  };
}

module.exports = { createJob };
