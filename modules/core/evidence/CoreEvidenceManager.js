const CoreEvidenceManager={
 attach(evidence,item){
  evidence.items=evidence.items||[];
  evidence.items.push(item);
  return evidence;
 }
};

export default CoreEvidenceManager;
