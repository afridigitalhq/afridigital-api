import { complianceReportingEngine } from "../compliance/ComplianceReportingEngine.js";
import { governanceDashboard } from "../dashboard/GovernanceDashboard.js";
import { identityAccessManager } from "../identity/IdentityAccessManager.js";
import { policyEnforcementEngine } from "../policy/PolicyEnforcementEngine.js";
import { privacyManagement } from "../privacy/PrivacyManagement.js";
import { securityAuditManager } from "../audit/SecurityAuditManager.js";
import { evidenceArchiveGovernance } from "../../investigation/archive/EvidenceArchiveGovernance.js";

class GovernanceTrustOrchestrator {

 coordinate(governanceEvent){

  return {

   identity:
    identityAccessManager.manage
     ? identityAccessManager.manage(governanceEvent)
     : null,

   policy:
    policyEnforcementEngine.enforce
     ? policyEnforcementEngine.enforce(governanceEvent)
     : null,

   privacy:
    privacyManagement.protect
     ? privacyManagement.protect(governanceEvent)
     : null,

   compliance:
    complianceReportingEngine.report
     ? complianceReportingEngine.report(governanceEvent)
     : null,

   audit:
    securityAuditManager.audit
     ? securityAuditManager.audit(governanceEvent)
     : null,

   evidence:
    evidenceArchiveGovernance.archive
     ? evidenceArchiveGovernance.archive(governanceEvent)
     : null,

   dashboard:
    governanceDashboard.display
     ? governanceDashboard.display(governanceEvent)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const governanceTrustOrchestrator =
 new GovernanceTrustOrchestrator();
