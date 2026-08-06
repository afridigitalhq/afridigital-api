const audits=[];

const AfriDebugProductionAudit={

  record(event={}){

    const audit={
      id:`AUDIT-${Date.now()}`,
      ...event,
      createdAt:Date.now()
    };

    audits.push(audit);

    return audit;

  },

  stats(){

    return{
      audits:audits.length
    };

  }

};

export default AfriDebugProductionAudit;
