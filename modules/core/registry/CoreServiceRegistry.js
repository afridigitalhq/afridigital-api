const CoreServiceRegistry={services:{
  storage:["CoreFileStorage","CoreAttachmentManager"],
  artifacts:["CoreArtifactManager","CorePackageBuilder","CoreExportEngine","CoreDownloadManager"],
  evidence:["CoreEvidenceVault","CoreBeforeSnapshot","CoreAfterSnapshot","CoreComparisonEngine","CoreEvidenceIdentity","CoreEvidenceIntegrity","CoreEvidenceChain","CoreEvidenceAuditBridge"],
  security:["CoreSecurityGateway","CoreSecurityRequest","CoreSecurityDecision","CoreSecurityPolicy","CoreSecurityAudit","CoreSecurityCaseBridge","CoreSecurityRuntime","CoreSecurityScanner","CoreFileScanner","CoreDependencyScanner","CoreSecretScanner","CoreIntegrityChecker","CoreSandboxValidator"],
  identity:["CoreUserManager","CoreOrganizationManager","CoreWorkspaceManager","CoreRoleManager","CorePermissionManager","CoreSessionManager","CoreAPIKeyManager","CoreIdentityAudit"],
  events:["CoreEventBus","CoreEventRegistry","CoreNotificationEngine","CoreWebhookManager","CoreMessageQueue"],
  ai:["CoreAIEngine","CorePromptManager","CoreMemoryManager","CoreEmbeddingService","CoreKnowledgeStore","CoreAgentRuntime"],
  analytics:["CoreAnalyticsEngine","CoreMetricsCollector","CoreUsageTracker","CoreReportEngine"],
  billing:["CoreBillingEngine","CoreSubscriptionManager","CoreInvoiceGenerator","CorePaymentGateway","CoreUsageBilling"],
  finance:["CoreLedgerEngine","CoreAccountManager","CoreTransactionEngine","CoreCurrencyEngine","CoreWalletEngine","CoreSettlementEngine"],
  case:["CoreCaseManager","CoreCaseRegistry","CoreCaseStatus","CoreCaseEvidence","CoreCaseTimeline","CoreCaseResolution","CoreCaseGateway","CoreCaseRequest","CoreCaseDecision","CoreCaseAudit"],
  africoin:["AfriCoinWalletManager","AfriCoinBalanceEngine","AfriCoinTransactionEngine","AfriCoinRewardEngine","AfriCoinLedgerAdapter"]
}};

export default CoreServiceRegistry;
