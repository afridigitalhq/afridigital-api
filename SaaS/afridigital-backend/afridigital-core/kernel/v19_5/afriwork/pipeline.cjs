const { createJob } = require("./job.schema.cjs");
const { moderate } = require("../moderation/moderator.cjs");
const { priceJob } = require("../pricing/pricing.engine.cjs");
const { autoPost } = require("../auto-posting/post.engine.cjs");
const { mapJob } = require("../geo/geo.engine.cjs");

function process(jobInput) {

  let job = createJob(jobInput);

  const check = moderate(job);
  if (!check.approved) {
    return { status: "rejected", flags: check.flags };
  }

  job = mapJob(job);
  job.pricing = priceJob(job);

  return autoPost(job);
}

module.exports = { process };
