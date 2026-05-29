const { send } = require("../stream/sse");
const { route } = require("../kernel/controlPlaneRouter");
const { recall, remember } = require("../memory/memoryStore");
const { log } = require("../analytics/metrics");

function safe(v){ return String(v || ""); }

async function runBrain(event = {}) {
  const from = safe(event?.payload?.from || event?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from);
  const text = safe(event?.payload?.text?.body) ||
               safe(event?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body);

  const decision = route({ from, text, raw: event });

  try {
    if (decision === "memory_query") {
      const mem = recall(from);
      send(from, JSON.stringify(mem));
      return { ok: true, type: "memory" };
    }

    if (decision === "ai_query") {
      remember(from, "last_query", text);
      send(from, "🧠 AI ready");
      return { ok: true, type: "ai" };
    }

    if (decision === "command_exec") {
      remember(from, "last_command", text);
      send(from, "⚙️ executed");
      return { ok: true, type: "command" };
    }

    send(from, "⚠️ unknown route");
    return { ok: false, reason: "no_route" };

  } catch (e) {
    log(e, "brain_error");
    send(from, "❌ brain failure");
    return { ok: false, error: e.message };
  }
}

module.exports = { runBrain };
