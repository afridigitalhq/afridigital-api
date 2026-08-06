import JSONExporter from "./exporters/AfriDebugJSONEvidenceExporter.js";
import HTMLExporter from "./exporters/AfriDebugHTMLEvidenceExporter.js";
import CSVExporter from "./exporters/AfriDebugCSVEvidenceExporter.js";

const exporters={
  json:JSONExporter,
  html:HTMLExporter,
  csv:CSVExporter
};

const AfriDebugEvidenceExportManager={

  export(format,evidence={}){

    const exporter=exporters[(format||"").toLowerCase()];

    if(!exporter){

      return{
        success:false,
        reason:"UNSUPPORTED_EXPORT_FORMAT",
        supported:Object.keys(exporters)
      };

    }

    return{
      success:true,
      export:exporter.export(evidence)
    };

  },

  supportedFormats(){

    return Object.keys(exporters);

  },

  health(){

    return{
      service:"AfriDebugEvidenceExportManager",
      status:"healthy"
    };

  }

};

export default AfriDebugEvidenceExportManager;
