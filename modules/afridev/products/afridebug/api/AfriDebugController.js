import AfriDebugInvestigationRuntime from "../runtime/AfriDebugInvestigationRuntime.js";

const AfriDebugController={
 investigate(repository){
  return AfriDebugInvestigationRuntime.investigate(repository);
 }
};

export default AfriDebugController;
