import CoreInvestigationEngine from "../../../../core/investigation/CoreInvestigationEngine.js";
import CoreInvestigationStageManager from "../../../../core/investigation/CoreInvestigationStageManager.js";

const AfriDebugInvestigationManager={
 start(context={}){
  return CoreInvestigationEngine.investigate(context);
 },
 stage(investigation,stage){
  return CoreInvestigationStageManager.advance(investigation,stage);
 }
};

export default AfriDebugInvestigationManager;
