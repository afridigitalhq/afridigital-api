const { register } = require('./registry');

// 🧠 MESSAGE TOOL
register("send_message", async (payload, ctx) => {
  return {
    ok: true,
    tool: "send_message",
    payload
  };
});

// 🧠 DEBUG TOOL
register("check_logs", async () => {
  return {
    ok: true,
    logs: "simulated logs checked"
  };
});

// 🧠 MEMORY ANALYSIS TOOL
register("analyze_memory", async (payload) => {
  return {
    ok: true,
    insight: "memory analyzed",
    input: payload
  };
});

// 🧠 FALLBACK TOOL
register("fallback", async (payload) => {
  return {
    ok: true,
    tool: "fallback",
    payload
  };
});
