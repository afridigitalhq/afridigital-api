const CoreCaseAudit={record(event){return {event,status:"CASE_AUDITED",timestamp:new Date().toISOString()};}};
export default CoreCaseAudit;
