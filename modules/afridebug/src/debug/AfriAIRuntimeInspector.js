const AfriAIRuntimeInspector = {

  inspect(runtime = {}){

    return {
      type:"RUNTIME_INSPECTION",
      runtime,
      timestamp:
        Date.now()
    };

  }

};

export default AfriAIRuntimeInspector;
