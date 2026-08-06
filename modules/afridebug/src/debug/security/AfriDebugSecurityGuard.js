const securityEvents=[];

const AfriDebugSecurityGuard = {

  validateEvent(event={}){

    const issues=[];

    if(!event.connectorId){
      issues.push("MISSING_CONNECTOR_ID");
    }

    if(!event.type){
      issues.push("MISSING_EVENT_TYPE");
    }

    if(!event.payload){
      issues.push("MISSING_PAYLOAD");
    }

    const result={
      allowed:issues.length===0,
      issues,
      checkedAt:Date.now()
    };

    securityEvents.push(result);

    return result;

  },


  sanitizePayload(payload={}){

    const clean={};

    for(const key of Object.keys(payload)){
      if(typeof payload[key] !== "function"){
        clean[key]=payload[key];
      }
    }

    return clean;

  },


  threatScore(event={}){

    let score=0;

    if(event.approvalRequired) score+=20;
    if(event.payload?.severity==="critical") score+=40;
    if(event.type==="runtime_error") score+=20;

    return {
      score,
      level:
        score >=70 ? "high" :
        score >=40 ? "medium" :
        "low",
      generatedAt:Date.now()
    };

  },


  stats(){

    return {
      securityChecks:securityEvents.length
    };

  },


  health(){

    return {
      service:"AfriDebugSecurityGuard",
      status:"healthy"
    };

  }

};

export default AfriDebugSecurityGuard;
