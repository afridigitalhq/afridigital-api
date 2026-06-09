function health() {
  return {
    status: "ok",
    service: "afri-ai-gateway-v5",
    timestamp: Date.now()
  };
}

module.exports = { health };
