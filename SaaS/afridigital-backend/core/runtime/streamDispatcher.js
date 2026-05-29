const { dispatch } = require('./dispatcher');
const {
  createTrace,
  addStep,
  completeTrace
} = require('../observability/tracer');

/**
 * STREAMING CONTROL PLANE
 */

async function streamDispatch(payload, stream) {

  const traceId =
    payload.traceId ||
    Math.random().toString(36).slice(2, 10);

  createTrace(traceId, payload);

  stream.send("trace", { traceId });

  addStep(traceId, { stage: "received" });
  stream.send("status", { stage: "received" });

  try {

    stream.send("status", { stage: "dispatching" });

    const result = await dispatch(payload);

    addStep(traceId, {
      stage: "completed",
      mode: result.mode
    });

    stream.send("result", result);

    completeTrace(traceId, result);

    stream.end();

    return {
      traceId,
      ...result
    };

  } catch (err) {

    addStep(traceId, {
      stage: "error",
      error: err.message
    });

    stream.send("error", { error: err.message });

    completeTrace(traceId, { ok: false });

    stream.end();

    throw err;
  }
}

module.exports = {
  streamDispatch
};
