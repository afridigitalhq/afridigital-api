export const commandNormalizer = {
  init() {},

  normalize(input) {
    if (!input) return null;

    return {
      type: (input.type || "UNKNOWN").toUpperCase(),
      payload: input.payload || {},
      meta: {
        source: "NORMALIZER",
        ts: Date.now()
      }
    };
  }
};
