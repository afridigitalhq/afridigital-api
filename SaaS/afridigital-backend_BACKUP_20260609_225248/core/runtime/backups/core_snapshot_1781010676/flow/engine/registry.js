const flows = {
  greetingFlow: async (payload) => {
    return {
      ok: true,
      flow: 'greetingFlow',
      result: 'Flow completed ✅'
    };
  },

  systemFlow: async () => {
    return {
      ok: false,
      flow: 'systemFlow',
      result: 'System fallback'
    };
  }
};

function getFlow(name) {
  return flows[name] || null;
}

module.exports = { getFlow };
