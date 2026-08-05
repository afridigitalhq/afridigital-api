const CoreEvidenceIdentity={create(source){return {id:"EVID-"+Date.now(),source,timestamp:new Date().toISOString()};}};
export default CoreEvidenceIdentity;
