const AfriAIDiagnosisParser = {

 parse(text=""){

  const content=text.toLowerCase();

  let severity="UNKNOWN";

  if(content.includes("high risk") || content.includes("high")){
    severity="HIGH";
  }
  else if(content.includes("medium")){
    severity="MEDIUM";
  }
  else if(content.includes("low")){
    severity="LOW";
  }

  let rootCause="UNKNOWN";

  const rootMatch=text.match(
    /possible root cause[:\s]+(.+)/i
  );

  if(rootMatch){
    rootCause=rootMatch[1].split("\n")[0].trim();
  }

  let recommendedFix="REVIEW_REQUIRED";

  const actionMatch=text.match(
    /recommended next action[:\s]+(.+)/i
  );

  if(actionMatch){
    recommendedFix=actionMatch[1].split("\n")[0].trim();
  }

  return {
    rootCause,
    severity,
    recommendedFix,
    confidence:
      rootCause==="UNKNOWN"
      ? "LOW"
      : "MEDIUM",
    status:"PARSED_DIAGNOSIS"
  };

 }

};

export default AfriAIDiagnosisParser;
