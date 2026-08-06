const LocalAIProvider = {
  name: "LocalAI",

  analyze(request = {}) {
    return {
      provider: this.name,
      status: "READY",
      request
    };
  }
};

export default LocalAIProvider;
