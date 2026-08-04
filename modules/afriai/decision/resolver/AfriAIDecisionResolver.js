import AfriAIIntentClassifier from "../classifier/AfriAIIntentClassifier.js";
import AfriAIConfidenceEngine from "../confidence/AfriAIConfidenceEngine.js";
import AfriAIDecisionPolicy from "../policy/AfriAIDecisionPolicy.js";
import AfriAIGuardrails from "../guardrails/AfriAIGuardrails.js";

const AfriAIDecisionResolver={
resolve(message=""){
const intent=AfriAIIntentClassifier.classify(message);

return{
intent,
confidence:AfriAIConfidenceEngine.score(message),
policy:AfriAIDecisionPolicy.evaluate(intent),
guardrails:AfriAIGuardrails.check(message),
status:"READY"
};
}
};

export default AfriAIDecisionResolver;
