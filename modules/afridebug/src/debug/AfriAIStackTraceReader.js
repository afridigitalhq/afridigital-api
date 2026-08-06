const AfriAIStackTraceReader = {

  read(trace = []){

    return {
      type:"STACK_TRACE",
      entries:
        trace,
      count:
        trace.length
    };

  }

};

export default AfriAIStackTraceReader;
