const AfriDebugAuditTimeline={
  record(event){
    return {event,time:new Date().toISOString()};
  }
};
export default AfriDebugAuditTimeline;
