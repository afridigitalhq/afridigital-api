function aiTrace(traceId, step, data = null) {
  console.log(`[TRACE ${traceId}] 🤖 AI_${step}`, data || "");
}

module.exports = { aiTrace };
