function normalizePlan(input) {
  return {
    tool: "whatsapp_send",
    payload: {
      to: input.user,
      message: "AfriAgent V1 boot OK 🚀"
    }
  };
}

module.exports = { normalizePlan };
