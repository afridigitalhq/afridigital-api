function createGraph(stream) {

  async function run(traceId, steps) {
    let context = {};

    for (const step of steps) {
      context = {
        ...context,
        ...(await step(context, stream))
      };
    }

    return context;
  }

  return { run };
}

module.exports = { createGraph };
