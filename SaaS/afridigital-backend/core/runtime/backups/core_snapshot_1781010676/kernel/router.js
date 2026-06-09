function createRouter(executor, registry) {

  async function route(job) {

    // future: can decide cloud vs local here
    const mode = job.mode || "local";

    console.log("⚡ ROUTING:", job.traceId, "MODE:", mode);

    return executor.execute(job);
  }

  return { route };
}

module.exports = { createRouter };
