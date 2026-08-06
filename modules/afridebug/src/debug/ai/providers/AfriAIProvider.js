const AfriAIProvider = {
  name: "AfriAI",

  analyze(request = {}) {
    return {
      provider: this.name,
      status: "READY",
      request
    };
  }
};

export default AfriAIProvider;
