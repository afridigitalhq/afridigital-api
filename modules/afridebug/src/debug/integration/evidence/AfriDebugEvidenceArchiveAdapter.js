const linked=[];

const AfriDebugEvidenceArchiveAdapter = {

  attach(evidence){

    const record={

      evidenceId:evidence.id || null,

      source:evidence.source || "unknown",

      archiveStatus:"ready",

      linkedAt:Date.now()

    };

    linked.push(record);

    return record;

  },

  list(){

    return linked;

  },

  stats(){

    return {

      linkedEvidence:linked.length

    };

  },

  health(){

    return {

      service:"AfriDebugEvidenceArchiveAdapter",

      status:"healthy"

    };

  }

};

export default AfriDebugEvidenceArchiveAdapter;
