import AfriCCTVSecurityAdapter from "../adapters/AfriCCTVSecurityAdapter.js";
import AfriCCTVCaseAdapter from "../adapters/AfriCCTVCaseAdapter.js";
import AfriCTVCEvidenceAdapter from "../adapters/AfriCTVCEvidenceAdapter.js";

const AfriCCTVIncidentRuntime={
  process(event){
    const security=AfriCCTVSecurityAdapter.inspect(event);
    const incident=AfriCCTVCaseAdapter.open({event,security});
    const evidence=AfriCTVCEvidenceAdapter.store({event,incident});

    return {
      security,
      incident,
      evidence,
      status:"INCIDENT_REGISTERED"
    };
  }
};

export default AfriCCTVIncidentRuntime;
