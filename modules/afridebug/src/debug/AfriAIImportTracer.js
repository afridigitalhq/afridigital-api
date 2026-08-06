const AfriAIImportTracer = {

  analyze(trace = []){

    return {
      type: "IMPORT_TRACE_ANALYSIS",

      events:
        trace.map(item => ({
          event:
            item.event || null,

          timestamp:
            item.timestamp || null,

          hasPayload:
            Boolean(item.payload)

        })),

      count:
        trace.length,

      status:
        "ANALYZED"

    };

  }

};

export default AfriAIImportTracer;
