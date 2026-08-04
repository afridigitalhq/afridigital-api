import AfriAIIntentClassifier from "../decision/classifier/AfriAIIntentClassifier.js";

const AfriAIIntentRouter = {
  resolve(message=""){
    return AfriAIIntentClassifier.classify(message);
  }
};

export default AfriAIIntentRouter;
