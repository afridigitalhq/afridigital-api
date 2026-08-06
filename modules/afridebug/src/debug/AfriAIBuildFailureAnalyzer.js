const AfriAIBuildFailureAnalyzer = {

  analyze(build = {}){

    return {
      type:"BUILD_ANALYSIS",
      status:
        build.status || "UNKNOWN",
      issues:
        build.issues || [],
      timestamp:
        Date.now()
    };

  }

};

export default AfriAIBuildFailureAnalyzer;
