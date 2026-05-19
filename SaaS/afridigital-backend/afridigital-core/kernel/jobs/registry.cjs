const bus = require("../v15/bus.cjs");
const { emit } = require("../events/spine.cjs");

function addJob(job) {
  bus.marketplace.jobs.push(job);
  emit("JOB_POSTED", job);
}

function addAd(ad) {
  bus.marketplace.ads.push(ad);
  emit("AD_POSTED", ad);
}

module.exports = { addJob, addAd };
