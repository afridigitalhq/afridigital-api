const ErrorInputAdapter = {

  normalize(input = {}) {

    const message =
      input.message ||
      input.error ||
      input.text ||
      "UNKNOWN_ERROR";

    return {
      source: "error",
      message,
      stack: input.stack || null,
      metadata: {
        receivedAt: Date.now()
      }
    };

  }

};

export default ErrorInputAdapter;
