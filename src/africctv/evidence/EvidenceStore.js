const evidence = new Map();


export class EvidenceStore {

 save(record){

  const item={
   id:`evidence-${Date.now()}`,
   createdAt:Date.now(),
   ...record
  };

  evidence.set(item.id,item);

  return item;
 }


 get(id){
  return evidence.get(id)||null;
 }


 list(){
  return [...evidence.values()];
 }

}


export const evidenceStore =
new EvidenceStore();
