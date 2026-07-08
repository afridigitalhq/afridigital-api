class AuditReporterTestOrchestrator {

 coordinate(event){

  return {
   module: "AuditReporterTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const AuditReporterTestOrchestrator =
 new AuditReporterTestOrchestrator();
