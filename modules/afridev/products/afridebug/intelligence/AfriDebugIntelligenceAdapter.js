import CoreIntelligenceEngine from "../../../../core/intelligence/CoreIntelligenceEngine.js";
import CoreAnalysisEngine from "../../../../core/intelligence/CoreAnalysisEngine.js";
import CorePatternAnalyzer from "../../../../core/intelligence/CorePatternAnalyzer.js";
import CoreReasoningEngine from "../../../../core/intelligence/CoreReasoningEngine.js";
import CoreRecommendationEngine from "../../../../core/intelligence/CoreRecommendationEngine.js";

const AfriDebugIntelligenceAdapter={
 investigate(input,context={}){
  return CoreIntelligenceEngine.analyze(input,{service:"AfriDebug",...context});
 },
 analyze(data){
  return CoreAnalysisEngine.analyze(data);
 },
 patterns(input,patterns=[]){
  return CorePatternAnalyzer.match(input,patterns);
 },
 reason(context){
  return CoreReasoningEngine.reason(context);
 },
 recommend(input){
  return CoreRecommendationEngine.suggest(input);
 }
};

export default AfriDebugIntelligenceAdapter;
