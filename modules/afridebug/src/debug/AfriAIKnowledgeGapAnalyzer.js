const AfriAIKnowledgeGapAnalyzer = {

  analyze(input = {}){

    const question = input.question || "";
    const response = input.response || "";

    const missingSignals = [
      "not listed",
      "not available",
      "not found",
      "not described",
      "contact our support"
    ];

    const hasGap = missingSignals.some(
      signal => response.toLowerCase().includes(signal)
    );

    return {
      type: hasGap ? "KNOWLEDGE_GAP" : "NO_KNOWLEDGE_GAP",
      severity: hasGap ? "HIGH" : "LOW",
      area: "AfriAI Knowledge Layer",
      question,
      response,
      cause: hasGap
        ? "Required knowledge entity may be missing from AI knowledge registry"
        : "Knowledge response appears valid",
      recommendation: hasGap
        ? "Register missing entity in AfriAI knowledge modules and validate again"
        : "No action required"
    };

  }

};

export default AfriAIKnowledgeGapAnalyzer;
