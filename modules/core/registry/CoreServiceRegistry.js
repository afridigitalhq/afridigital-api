const CoreServiceRegistry={services:{
  storage:["CoreFileStorage","CoreAttachmentManager"],
  artifacts:["CoreArtifactManager","CorePackageBuilder","CoreExportEngine","CoreDownloadManager"],
  evidence:["CoreEvidenceVault","CoreBeforeSnapshot","CoreAfterSnapshot","CoreComparisonEngine"]
}};

export default CoreServiceRegistry;
