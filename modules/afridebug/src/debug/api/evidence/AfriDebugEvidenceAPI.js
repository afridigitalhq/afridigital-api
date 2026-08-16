import Exporter from "../../evidence/export/AfriDebugEvidenceExporter.js";
import Archive from "../../../../../src/afridebug/platform/evidence/AfriDebugEvidenceArchive.js";

const AfriDebugEvidenceAPI = {

  create(input = {}){

    return Exporter.create(input);

  },

  archive(input = {}){

    return Archive.create(input);

  },

  exports(){

    return Exporter.list();

  },

  archives(){

    return Archive.list();

  },

  health(){

    return {

      service:"AfriDebugEvidenceAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugEvidenceAPI;
