import Storage from "../storage/AfriDebugStorage.js";

const AfriDebugEvidenceArchive = {

  create(input = {}) {

    const data = Storage.get();

    if(!data.archives){
      data.archives = [];
    }

    const archive = {

      id:`ARCHIVE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      caseId:input.caseId || null,

      investigationId:input.investigationId || null,

      sections:{
        report:input.report || null,
        snapshots:input.snapshots || [],
        timeline:input.timeline || [],
        verification:input.verification || null,
        resolution:input.resolution || null
      },

      status:"READY_FOR_REVIEW",

      createdAt:Date.now()
    };

    data.archives.push(archive);

    Storage.update(data);

    return archive;
  },


  get(id){

    const data = Storage.get();

    return (data.archives || []).find(
      x=>x.id===id
    );
  },


  list(){

    return Storage.get().archives || [];
  },


  export(id){

    const archive = this.get(id);

    if(!archive){

      return {
        success:false,
        reason:"ARCHIVE_NOT_FOUND"
      };

    }

    return {
      success:true,
      format:"CLIENT_EVIDENCE_PACKAGE",
      archive
    };
  },


  stats(){

    return {
      archives:
        (Storage.get().archives || []).length
    };
  }

};

export default AfriDebugEvidenceArchive;
