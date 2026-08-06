const exports=[];

const AfriDebugEvidenceExportRegistry={

  create(input={}){

    const record={

      exportId:"EXPORT-"+Date.now(),

      evidenceId:input.evidenceId||null,

      format:input.format||"json",

      requestedBy:input.requestedBy||"system",

      status:"queued",

      createdAt:Date.now()

    };

    exports.push(record);

    return record;

  },

  complete(exportId){

    const record=exports.find(
      e=>e.exportId===exportId
    );

    if(!record){

      return{
        success:false,
        reason:"EXPORT_NOT_FOUND"
      };

    }

    record.status="completed";
    record.completedAt=Date.now();

    return{
      success:true,
      export:record
    };

  },

  list(){

    return exports;

  },

  stats(){

    return{
      exports:exports.length
    };

  },

  health(){

    return{
      service:"AfriDebugEvidenceExportRegistry",
      status:"healthy"
    };

  }

};

export default AfriDebugEvidenceExportRegistry;
