export class EvidenceArchiveGovernance{

 register(item){

  return {
   ...item,
   archive:"CONTROLLED"
  };

 }

}

export const evidenceArchiveGovernance =
new EvidenceArchiveGovernance();
