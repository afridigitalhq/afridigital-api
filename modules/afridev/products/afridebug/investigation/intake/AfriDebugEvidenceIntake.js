import AfriDebugCoreSecurityAdapter from "../../adapters/AfriDebugCoreSecurityAdapter.js";

const AfriDebugEvidenceIntake={
  collect(source){
    const security=AfriDebugCoreSecurityAdapter.scan(source);

    return {
      source,
      security,
      status:"SECURITY_PENDING",
      timestamp:new Date().toISOString()
    };
  }
};

export default AfriDebugEvidenceIntake;
