class IntelligenceBootstrapRegistry {

 constructor(){
  this.registry = {
   master: "MasterIntelligenceOrchestrator",
   cognitive: "CognitiveDecisionOrchestrator",
   intelligence: "AfriAIIntelligenceOrchestrator",
   ecosystem: "EcosystemIntelligenceOrchestrator",
   operations: "OperationsExecutionOrchestrator",
   command: "CameraCommandCenter",
   governance: "GovernanceTrustOrchestrator"
  };
 }

 getRegistry(){
  return this.registry;
 }

 hasOwner(owner){
  return Object.values(this.registry).includes(owner);
 }

}

export const intelligenceBootstrapRegistry =
 new IntelligenceBootstrapRegistry();
