/**
 * 🔵 RENDER CI RECEIVER
 * transforms deploy logs into AFRISCAN graph events
 */

const { normalize } = require("../../schema/event.schema");
const { broadcast } = require("../../governor/broadcast.safe");
const { formatRenderLog } = require("../../ci/render.stream");

function handleRenderEvent(log) {
  const event = formatRenderLog(log);
  broadcast(event);
  return event;
}

module.exports = {
  handleRenderEvent
};
