const AfriFixRuntimeMigrationMap={
  status:"APPROVED",
  policy:"ADAPTERS_ONLY",
  coreMigration:false,
  targets:{
    "18":"events",
    "19":"evidence",
    "22":"security",
    "27":"scan/registry",
    "29":"events",
    "30":"events/storage",
    "33":"registry",
    "34":"storage/evidence"
  },
  implementations:{
    events:"./AfriFixRuntimeEventsAdapter.js",
    evidence:"./AfriFixRuntimeEvidenceAdapter.js",
    security:"./AfriFixRuntimeSecurityAdapter.js",
    "scan/registry":"./AfriFixRuntimeScanRegistryAdapter.js",
    "events/storage":"./AfriFixRuntimeEventStoreAdapter.js",
    registry:"./AfriFixRuntimeRegistryAdapter.js",
    "storage/evidence":"./AfriFixRuntimeStorageEvidenceAdapter.js"
  }
};
export default AfriFixRuntimeMigrationMap;
