const AfriAIKnowledgeRepairMapper = {

  map(finding = {}){

    const question =
      finding.question || "";

    let target = "Unknown";

    if(question.toLowerCase().includes("afrieclass")){
      target = "AfriEducation/AfriEClass";
    }

    return {

      type: "KNOWLEDGE_REPAIR_PLAN",

      severity:
        finding.severity || "MEDIUM",

      detectedIssue:
        finding.type || "UNKNOWN",

      repairTarget:
        target,

      action:
        "Update AfriAI knowledge registry",

      approvalRequired:
        true,

      executionMode:
        "AFRINUCCHAIN_APPROVAL"

    };

  }

};

export default AfriAIKnowledgeRepairMapper;
