const classifyIntent = require("../ai/intent.classifier");
const resolve = require("../ai/bridge/module.resolver");
const { dispatch } = require("../ai/bridge/action.dispatcher");
const bus = require("../../realtime/event.stream");

async function handleMessage(req, res) {
  const { message, traceId } = req.body;

  const intent = classifyIntent(message);
  const route = resolve(intent);

  const result = await dispatch(intent, {
    message,
    traceId
  });

  bus.emit("CHAT_FLOW", {
    traceId,
    message,
    intent,
    route,
    result
  });

  return res.json({
    ok: true,
    intent,
    route,
    result
  });
}

module.exports = { handleMessage };
