const timelines = [];

const AfriDebugEvidenceTimeline = {

  record(input = {}) {

    const event = {
      id:`EVENT-${Date.now()}`,
      caseId:input.caseId || null,
      type:input.type || "UNKNOWN",
      actor:input.actor || "SYSTEM",
      details:input.details || null,
      timestamp:Date.now()
    };

    timelines.push(event);

    return event;
  },


  history(caseId){

    return timelines.filter(
      x=>x.caseId===caseId
    );
  },


  stats(){

    return {
      events:timelines.length
    };
  }

};

export default AfriDebugEvidenceTimeline;
