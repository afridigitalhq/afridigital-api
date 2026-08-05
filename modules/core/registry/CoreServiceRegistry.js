const CoreServiceRegistry={services:{
  storage:["CoreFileStorage","CoreAttachmentManager"],
  artifacts:["CoreArtifactManager","CorePackageBuilder","CoreExportEngine","CoreDownloadManager"],
  evidence:["CoreEvidenceVault","CoreBeforeSnapshot","CoreAfterSnapshot","CoreComparisonEngine"],
  security:["CoreSecurityScanner","CoreFileScanner","CoreDependencyScanner","CoreSecretScanner","CoreIntegrityChecker","CoreSandboxValidator"],
  identity:["CoreUserManager","CoreOrganizationManager","CoreWorkspaceManager","CoreRoleManager","CorePermissionManager","CoreSessionManager","CoreAPIKeyManager","CoreIdentityAudit"],
  events:["CoreEventBus","CoreEventRegistry","CoreNotificationEngine","CoreWebhookManager","CoreMessageQueue"]
}};

export default CoreServiceRegistry;
