const bus = require("./controlBus");

/**
 * Bridge ALL existing AI subsystems into Control Plane
 */
function attachControlPlane(app, deps = {}) {

  const { requestHooks, aiHooks } = deps;

  console.log("🔗 CONNECTING CONTROL PLANE TO AI SYSTEMS...");

  // 1. HTTP / REQUEST LAYER
  if (requestHooks) {
    app.use((req, res, next) => {
      bus.emitEvent({
        type: "HTTP_REQUEST",
        stage: "received",
        traceId: req.traceId || "no-trace",
        payload: {
          path: req.path,
          method: req.method
        }
      });

      next();
    });
  }

  // 2. AI LIFECYCLE LAYER
  if (aiHooks) {
    global.instrumentAI = (traceId, input) => {
      bus.emitEvent({
        type: "AI_REQUEST",
        stage: "received",
        traceId,
        payload: { input }
      });

      return aiHooks(traceId, input);
    };
  }

  // 3. ERROR / SYSTEM EVENTS
  process.on("uncaughtException", (err) => {
    bus.emitEvent({
      type: "SYSTEM_ERROR",
      stage: "crash",
      traceId: "system",
      payload: {
        message: err.message,
        stack: err.stack
      }
    });
  });

  process.on("unhandledRejection", (err) => {
    bus.emitEvent({
      type: "SYSTEM_ERROR",
      stage: "promise_rejection",
      traceId: "system",
      payload: {
        message: err?.message || String(err)
      }
    });
  });

  console.log("🧠 CONTROL PLANE CONNECTED TO AI BRAIN");
}

module.exports = { attachControlPlane };

// PIPE INTO ADMIN STREAM
const { emitAdminEvent } = require("../../realtime/admin-stream");

function forwardToAdminStream(event) {
  emitAdminEvent("CONTROL_PLANE_EVENT", event);
}

module.exports.forwardToAdminStream = forwardToAdminStream;
