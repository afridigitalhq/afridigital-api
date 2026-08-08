import CoreEvidenceVault from "../../../../core/evidence/CoreEvidenceVault.js";
const AfriFixRuntimeEvidenceAdapter={store(item){return CoreEvidenceVault.store({service:"AfriFix",...item});},retrieve(id){return CoreEvidenceVault.retrieve(id);}};
export default AfriFixRuntimeEvidenceAdapter;
