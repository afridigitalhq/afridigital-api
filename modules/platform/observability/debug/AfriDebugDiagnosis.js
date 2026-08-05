const AfriDebugDiagnosis = {

  analyze(error,context={}){

    const message =
      error?.message || String(error);

    let diagnosis = {
      type:"UNKNOWN",
      message,
      severity:"LOW",
      location:context.location || "unknown",
      recommendation:"Inspect runtime trace"
    };

    if(message.includes("ReferenceError")){
      diagnosis = {
        type:"REFERENCE_ERROR",
        message,
        severity:"MEDIUM",
        location:context.location || "unknown",
        recommendation:"Check variable declaration and execution scope"
      };
    }

    if(message.includes("SyntaxError")){
      diagnosis = {
        type:"SYNTAX_ERROR",
        message,
        severity:"HIGH",
        location:context.location || "unknown",
        recommendation:"Validate file syntax before execution"
      };
    }

    return {
      diagnosis:true,
      analyzedAt:new Date().toISOString(),
      ...diagnosis,
      requiresHumanReview:true
    };

  }

};

export default AfriDebugDiagnosis;
