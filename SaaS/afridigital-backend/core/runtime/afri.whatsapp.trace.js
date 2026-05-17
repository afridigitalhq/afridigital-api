function whatsappTrace(traceId, step, data = null) {
  console.log(`[TRACE ${traceId}] 📲 WHATSAPP_${step}`, data || "");
}

module.exports = { whatsappTrace };
