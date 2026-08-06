const AfriAIKnowledgeRegistryLocator = {

  locate(input = {}){

    const question =
      input.question || "";

    const normalized =
      question.toLowerCase();

    let target = {
      module:"Unknown",
      path:"Unknown",
      reason:"No matching knowledge registry detected"
    };

    if(normalized.includes("afrieclass") ||
       normalized.includes("education") ||
       normalized.includes("classroom")){

      target = {
        module:"EducationKnowledge",
        path:"src/afriai/knowledge/EducationKnowledge.js",
        reason:"Education-related query detected"
      };

    }

    if(normalized.includes("africommerce") ||
       normalized.includes("marketplace") ||
       normalized.includes("shop")){

      target = {
        module:"ProductKnowledge",
        path:"src/afriai/knowledge/ProductKnowledge.js",
        reason:"Commerce-related query detected"
      };

    }

    return {

      type:"KNOWLEDGE_REGISTRY_LOCATION",

      question,

      target,

      nextAction:
        "Review target knowledge registry before approval"

    };

  }

};

export default AfriAIKnowledgeRegistryLocator;
