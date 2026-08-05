import AfriDebugCoreSecurityAdapter from "../../adapters/AfriDebugCoreSecurityAdapter.js";
import AfriDebugCoreCaseAdapter from "../../adapters/AfriDebugCoreCaseAdapter.js";
import CoreEvidenceVault from "../../../../core/evidence/CoreEvidenceVault.js";

const AfriDebugEvidenceIntake={
  collect(source){
    const security=AfriDebugCoreSecurityAdapter.scan(source);
    const investigation=AfriDebugCoreCaseAdapter.openCase({source,security});
    const evidence=CoreEvidenceVault.store({source,investigation});

    return {
      source,
      security,
      investigation,
      evidence,
      status:"EVIDENCE_REGISTERED",
      timestamp:new Date().toISOString()
    };
  }
};

export default AfriDebugEvidenceIntake;
