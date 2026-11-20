const AfriAIGroundingGuard = {
  evaluate(response = "", knowledge = {}) {
    const text = typeof response === "string" ? response.trim() : "";

    if (!text) {
      return {
        supported: false,
        unsupportedClaims: ["EMPTY_RESPONSE"],
        status: "GROUNDING_FAILED"
      };
    }

    if (knowledge?.grounded !== true) {
      return {
        supported: false,
        unsupportedClaims: [
          knowledge?.type || "KNOWLEDGE_NOT_GROUNDED"
        ],
        status: "GROUNDING_FAILED"
      };
    }

    const source = JSON.stringify(knowledge).toLowerCase();
    const responseText = text.toLowerCase();
    const unsupportedClaims = [];

    const forbiddenClaims = [
      "real-time information",
      "governments",
      "digital currency and financial services",
      "financial services",
      "payment gateway",
      "banking platform",
      "currently available",
      "currently supports",
      "already supports"
    ];

    for (const claim of forbiddenClaims) {
      if (responseText.includes(claim) && !source.includes(claim)) {
        unsupportedClaims.push(claim);
      }
    }

    const productNames = Object.keys(knowledge.products || {});
    for (const product of productNames) {
      const lowerProduct = product.toLowerCase();
      if (responseText.includes(lowerProduct) && !source.includes(lowerProduct)) {
        unsupportedClaims.push(product);
      }
    }

    const platformDescription =
      knowledge.platform?.platform?.description ||
      knowledge.platform?.description ||
      "";

    const meaningfulTerms = platformDescription
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length >= 5);

    if (platformDescription) {
      const responseWords = new Set(
        responseText.split(/[^a-z0-9]+/).filter(word => word.length >= 5)
      );

      const groundedTerms = [...new Set(meaningfulTerms)]
        .filter(term => responseWords.has(term));

      if (groundedTerms.length < 2) {
        unsupportedClaims.push("INSUFFICIENT_GROUNDED_CONTENT");
      }

      const supported = unsupportedClaims.length === 0;
      return {
        supported,
        unsupportedClaims,
        groundedTerms,
        status: supported ? "GROUNDING_SUPPORTED" : "GROUNDING_FAILED"
      };
    }

    const supported = unsupportedClaims.length === 0;
    return {
      supported,
      unsupportedClaims,
      groundedTerms: [],
      status: supported ? "GROUNDING_SUPPORTED" : "GROUNDING_FAILED"
    };
  }
};

export default AfriAIGroundingGuard;
