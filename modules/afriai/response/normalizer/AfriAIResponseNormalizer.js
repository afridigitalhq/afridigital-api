const AfriAIResponseNormalizer = {

 normalize(response=""){

  const text=response.replace(/```json|```/g,"").trim();

  const jsonMatch=text.match(/\{[\s\S]*\}/);

  if(jsonMatch){

    try{
      return JSON.parse(jsonMatch[0]);
    }
    catch(e){}
  }


  const root =
    text.match(/possible root cause[:\s]+([\s\S]*?)(?:risk level|recommended)/i);

  const risk =
    text.match(/risk level[:\s]+([^\n]+)/i);

  const action =
    text.match(/recommended next action[:\s]+([\s\S]*)/i);


  return {

    rootCause:
      root
      ? root[1].trim()
      : "UNKNOWN",

    riskLevel:
      risk
      ? risk[1].trim()
      : "UNKNOWN",

    recommendedAction:
      action
      ? action[1].trim()
      : "REVIEW_REQUIRED",

    status:"NORMALIZED_RESPONSE"

  };

 }

};

export default AfriAIResponseNormalizer;
