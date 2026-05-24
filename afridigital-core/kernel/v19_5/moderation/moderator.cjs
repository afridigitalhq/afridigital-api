function moderate(job) {
  let flags = [];

  if (!job.title || job.title.length < 5) flags.push("TITLE_TOO_SHORT");
  if (job.budget < 0) flags.push("INVALID_BUDGET");
  if (job.description?.includes("scam")) flags.push("SUSPICIOUS_CONTENT");

  return {
    approved: flags.length === 0,
    flags
  };
}

module.exports = { moderate };
