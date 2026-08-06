const AfriAIErrorAnalyzer = {

  analyze(error = {}){

    return {
      type:"ERROR_ANALYSIS",
      message:
        error.message || "NO_ERROR",
      severity:"INFO",
      timestamp:
        Date.now()
    };

  }

};

export default AfriAIErrorAnalyzer;
