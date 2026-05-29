const { dispatch } = require('./dispatcher');
const {
  createTrace,
  addStep,
  completeTrace
} = require('../observability/tracer');

/**
 * TRACE-AWARE CONTROL PLANE
 * Wraps dispatcher with full observability
 */

async function traceDispatch(payload) {

  const traceId =
    payload.traceId ||
    Math.random().toString(36).slice(2, 10);

  const trace = createTrace(traceId, payload);

  addStep(traceId, {
    stage: "received",
    data: payload
  });

  try {
    addStep(traceId, { stage: "dispatch_start" });

    const result = await dispatch(payload);

    addStep(traceId, {
      stage: "dispatch_complete",
      mode: result.mode
    });

    completeTrace(traceId, result);

    return {
      traceId,
      ...result
    };

  } catch (err) {

    addStep(traceId, {
      stage: "error",
      error: err.message
    });

    completeTrace(traceId, {
      ok: false,
      error: err.message
    });

    throw err;
  }
}

module.exports = {
  traceDispatch
};
