const AfriFixRemediationPlanner = {

 plan(diagnosis={}){

  const severity =
    diagnosis.severity ||
    diagnosis.riskLevel ||
    "UNKNOWN";


  return {

    diagnosis,

    remediation:{
      objective:
        "Resolve identified issue while preserving evidence",

      priority:
        severity === "HIGH"
        ? "URGENT"
        : severity === "MEDIUM"
        ? "NORMAL"
        : "LOW",

      actions:[
        "Review affected component",
        "Apply controlled remediation",
        "Run verification checks",
        "Generate evidence report"
      ],

      requiresHumanApproval:true
    },

    verification:[
      "Re-run investigation pipeline",
      "Confirm component health",
      "Validate regression status"
    ],

    status:"REMEDIATION_PLAN_CREATED"

  };

 }

};

export default AfriFixRemediationPlanner;
