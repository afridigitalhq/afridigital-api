import ReportGenerator from "../reports/AfriDebugIncidentReportGenerator.js";
import ResolutionEngine from "../resolution/AfriDebugResolutionEngine.js";


const AfriDebugIncidentPipeline = {


  process(event){

    const report =
      ReportGenerator.generate(event);


    const analysis =
      ResolutionEngine.analyze(report);


    return {

      incident: report,

      analysis,

      pipelineStatus:
        "completed",

      completedAt:
        Date.now()

    };

  },


  health(){

    return {

      service:
        "AfriDebugIncidentPipeline",

      status:
        "healthy"

    };

  }


};


export default AfriDebugIncidentPipeline;
