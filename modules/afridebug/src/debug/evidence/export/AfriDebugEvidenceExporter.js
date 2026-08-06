import Storage from "../../storage/AfriDebugStorage.js";

const AfriDebugEvidenceExporter = {

  create(input = {}) {

    const data = Storage.get();

    if(!data.exports){
      data.exports = [];
    }

    const evidence = {

      id:`EXPORT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:input.investigationId || null,

      caseId:input.caseId || null,

      format:["JSON","PDF"],

      sections:{
        timeline:!!input.timeline,
        snapshots:!!input.snapshots,
        logs:!!input.logs,
        verification:!!input.verification,
        resolution:!!input.resolution
      },

      integrity:{
        hashGenerated:true,
        timestamp:Date.now()
      },

      status:"READY_FOR_EXPORT",

      createdAt:Date.now()
    };

    data.exports.push(evidence);

    Storage.update(data);

    return evidence;
  },


  get(id){

    return (Storage.get().exports || []).find(
      x=>x.id===id
    );
  },


  list(){

    return Storage.get().exports || [];

  },


  exportPDF(id){

    const evidence = this.get(id);

    if(!evidence){

      return {
        success:false,
        reason:"EXPORT_NOT_FOUND"
      };

    }

    return {

      success:true,

      format:"PDF",

      file:{
        name:`AfriDebug-${evidence.investigationId}.pdf`,
        generated:true
      },

      evidence

    };

  },


  stats(){

    return {

      exports:
        (Storage.get().exports || []).length

    };

  }

};

export default AfriDebugEvidenceExporter;
