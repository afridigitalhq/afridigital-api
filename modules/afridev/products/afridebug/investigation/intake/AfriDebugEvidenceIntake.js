const AfriDebugEvidenceIntake={
  collect(source){
    return {
      source,
      status:"EVIDENCE_RECEIVED",
      timestamp:new Date().toISOString()
    };
  }
};

export default AfriDebugEvidenceIntake;
