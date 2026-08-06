const AfriDebugServiceManifest={
 name:"AfriDebug",
 version:"1.0.0",

 services:{
  runtime:"AfriDebugRuntime",
  pipeline:"AfriDebugPipelineAdapter",
  investigation:"AfriDebugInvestigationRuntime",
  intelligence:"AfriDebugIntelligenceAdapter",
  patch:"AfriDebugPatchAdapter",
  delivery:"AfriDebugDeliveryAdapter"
 },

 coreDependencies:[
  "CoreRuntimeEngine",
  "CoreRuntimeRegistry",
  "CorePipelineEngine",
  "CorePipelineRegistry",
  "CoreIntelligenceEngine",
  "CorePatchEngine",
  "CorePatchValidator",
  "CoreReportGenerator"
 ]
};

export default AfriDebugServiceManifest;
