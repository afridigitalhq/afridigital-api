import CoreEvidenceIdentity from "./chain/CoreEvidenceIdentity.js";
import CoreEvidenceIntegrity from "./chain/CoreEvidenceIntegrity.js";
import CoreEvidenceChain from "./chain/CoreEvidenceChain.js";

const CoreEvidenceVault={
  store(data){
    const identity=CoreEvidenceIdentity.create(data.source);
    const integrity=CoreEvidenceIntegrity.verify(data);
    const chain=CoreEvidenceChain.link({identity,integrity,data});

    return {
      identity,
      integrity,
      chain,
      status:"EVIDENCE_SECURED"
    };
  }
};

export default CoreEvidenceVault;
