const CoreScanReport = {

 generate(scanResult = {}){

  const duplicates = scanResult.duplicates || {};
  const security = scanResult.security || {};
  const dependencies = scanResult.dependencies || {};

  return {
   component:"AfriScan Report",

   repositoryHealth:{
    filesMapped:scanResult.mapped?.fileCount || 0,
    directoriesMapped:scanResult.mapped?.directoryCount || 0
   },

   duplicateAnalysis:{
    totalDuplicates:duplicates.duplicateCount || 0,
    filesScanned:duplicates.filesScanned || 0,
    status:duplicates.status || "UNKNOWN"
   },

   securityAnalysis:{
    status:security.status || "UNKNOWN",
    checks:security.checks || []
   },

   dependencyAnalysis:{
    dependencies:dependencies.dependencyCount || 0,
    devDependencies:dependencies.devDependencyCount || 0,
    status:dependencies.status || "UNKNOWN"
   },

   evidence:{
    status:scanResult.evidence?.status || "NOT_AVAILABLE"
   },

   generatedAt:new Date().toISOString(),
   status:"REPORT_GENERATED"
  };

 }

};

export default CoreScanReport;
