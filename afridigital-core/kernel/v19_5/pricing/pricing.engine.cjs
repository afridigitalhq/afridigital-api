function priceJob(job) {
  let base = 100;

  if (job.type === "freelance") base = 1000;
  if (job.type === "ad") base = 5000;
  if (job.type === "gig") base = 300;

  if (job.location !== "global") base *= 1.2;

  return {
    suggestedPrice: base
  };
}

module.exports = { priceJob };
