function createExecutor(bus, registry) {

  async function execute(job) {
    const worker = registry.get(job.target);

    if (!worker) {
      console.log("❌ NO WORKER:", job.target);
      return;
    }

    // LOCAL EXECUTION MODE
    return await worker(job, bus);
  }

  return { execute };
}

module.exports = { createExecutor };
