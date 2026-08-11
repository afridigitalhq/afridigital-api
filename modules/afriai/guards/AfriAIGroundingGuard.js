const AfriAIGroundingGuard = {

  evaluate(response = "", knowledge = {}){

    const text =
      typeof response === "string"
        ? response.trim()
        : "";

    const source =
      JSON.stringify(knowledge)
        .toLowerCase();

    const unsupportedClaims = [];

    if(!text){

      return {
        supported:false,
        unsupportedClaims:["EMPTY_RESPONSE"],
        status:"GROUNDING_FAILED"
      };

    }

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

    for(const claim of forbiddenClaims){

      if(
        text.toLowerCase().includes(claim) &&
        !source.includes(claim)
      ){

        unsupportedClaims.push(claim);
      }

    }

    const productNames =
      Object.keys(
        knowledge.products || {}
      );

    for(const product of productNames){

      const lowerProduct =
        product.toLowerCase();

      if(
        text.toLowerCase().includes(lowerProduct) &&
        !source.includes(lowerProduct)
      ){

        unsupportedClaims.push(product);
      }

    }

    const knowledgeTerms = [];

    const platformDescription =
      knowledge.platform?.platform?.description ||
      knowledge.platform?.description ||
      "";

    if(platformDescription){
      knowledgeTerms.push(
        ...platformDescription
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(word => word.length >= 5)
      );
    }

    const meaningfulTerms =
      [...new Set(knowledgeTerms)];

    const responseWords =
      new Set(
        text
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(word => word.length >= 5)
      );

    const groundedTerms =
      meaningfulTerms.filter(
        term => responseWords.has(term)
      );

    if(
      platformDescription &&
      groundedTerms.length < 2
    ){
      unsupportedClaims.push(
        "INSUFFICIENT_GROUNDED_CONTENT"
      );
    }

    const supported =
      unsupportedClaims.length === 0;

    return {
      supported,
      unsupportedClaims,
      groundedTerms,
      status:supported
        ? "GROUNDING_SUPPORTED"
        : "GROUNDING_FAILED"
    };

  }

};

export default AfriAIGroundingGuard;
