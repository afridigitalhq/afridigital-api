const AfriAIDiagnosisContract = {

  create(input={}){

    return {
      rootCause:
        input.rootCause || "UNKNOWN",

      affectedComponent:
        input.affectedComponent || "UNKNOWN",

      severity:
        input.severity || "UNKNOWN",

      confidence:
        input.confidence || "LOW",

      recommendedFix:
        input.recommendedFix || "REVIEW_REQUIRED",

      verificationSteps:
        input.verificationSteps || [],

      status:"DIAGNOSIS_STRUCTURED"
    };

  },

  validate(diagnosis){

    const required=[
      "rootCause",
      "affectedComponent",
      "severity",
      "confidence",
      "recommendedFix"
    ];

    const valid=required.every(
      key=>diagnosis[key] !== undefined
    );

    return {
      valid,
      status:valid
        ? "DIAGNOSIS_VALID"
        : "DIAGNOSIS_INVALID"
    };

  }

};

export default AfriAIDiagnosisContract;
