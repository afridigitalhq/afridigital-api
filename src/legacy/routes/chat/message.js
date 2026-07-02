const classifyIntent = require("../../core/ai/intent.classifier");
const resolve = require("../../core/ai/bridge/module.resolver");
const { dispatch } = require("../../core/ai/bridge/action.dispatcher");

async function chatHandler(req, res) {
  const { message, traceId } = req.body;

  const intent = classifyIntent(message);
  const route = resolve(intent);

  const result = await dispatch(intent, {
    message,
    traceId
  });

  return res.json({
    ok: true,
    intent,
    route,
    result
  });
}

module.exports = { chatHandler };
