import CoreStorageEngine from "../../../../core/storage/CoreStorageEngine.js";
import CoreEvidenceVault from "../../../../core/evidence/CoreEvidenceVault.js";
const AfriFixRuntimeStorageEvidenceAdapter={save(file,context={}){return CoreStorageEngine.save(file,{service:"AfriFix",...context});},storeEvidence(item){return CoreEvidenceVault.store({service:"AfriFix",...item});}};
export default AfriFixRuntimeStorageEvidenceAdapter;
