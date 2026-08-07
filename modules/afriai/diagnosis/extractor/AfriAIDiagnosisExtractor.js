const AfriAIDiagnosisExtractor = {

 extract(input={}){

  const text =
    typeof input === "string"
    ? input
    : JSON.stringify(input);


  const root =
    text.match(
      /(?:possible root cause|root cause)[:\s]+([\s\S]*?)(?:risk level|risk|recommended next action|recommended)/i
    );


  const risk =
    text.match(
      /(?:risk level|risk)[:\s]+([a-z]+)/i
    );


  const action =
    text.match(
      /(?:recommended next action|recommended fix|next action)[:\s]+([\s\S]*?)(?:\n\n|$)/i
    );


  return {

    rootCause:
      root
      ? root[1]
          .replace(/[\n\r]+/g," ")
          .trim()
      : "UNKNOWN",


    riskLevel:
      risk
      ? risk[1].toUpperCase()
      : "UNKNOWN",


    recommendedAction:
      action
      ? action[1]
          .replace(/[\n\r]+/g," ")
          .trim()
      : "REVIEW_REQUIRED",


    status:"DIAGNOSIS_EXTRACTED"

  };

 }

};

export default AfriAIDiagnosisExtractor;
