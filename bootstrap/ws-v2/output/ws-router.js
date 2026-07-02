
function routeWSMessage(msg, handlers = {}) {
  if (handlers[msg.type]) return handlers[msg.type](msg);
  return { ok: false, error: "NO_HANDLER" };
}

module.exports = { routeWSMessage };
