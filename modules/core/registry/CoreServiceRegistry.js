const CoreServiceRegistry={services:{
  storage:["CoreFileStorage","CoreAttachmentManager"],
  artifacts:["CoreArtifactManager","CorePackageBuilder","CoreExportEngine","CoreDownloadManager"],
  evidence:["CoreEvidenceVault","CoreBeforeSnapshot","CoreAfterSnapshot","CoreComparisonEngine"],
  security:["CoreSecurityScanner","CoreFileScanner","CoreDependencyScanner","CoreSecretScanner","CoreIntegrityChecker","CoreSandboxValidator"]
}};

export default CoreServiceRegistry;
