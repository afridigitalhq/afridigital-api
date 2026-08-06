const AfriDebugJSONEvidenceExporter={

  export(evidence={}){

    return{

      exportId:"JSON-"+Date.now(),

      format:"json",

      fileName:`${evidence.evidenceId||"evidence"}.json`,

      content:JSON.stringify(evidence,null,2),

      size:JSON.stringify(evidence).length,

      exportedAt:Date.now()

    };

  },

  health(){

    return{

      service:"AfriDebugJSONEvidenceExporter",

      status:"healthy"

    };

  }

};

export default AfriDebugJSONEvidenceExporter;
