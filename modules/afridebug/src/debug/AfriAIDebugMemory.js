const memory = [];

const AfriAIDebugMemory = {

  remember(report){

    memory.push(report);

    return memory.length;

  },

  all(){

    return memory;

  }

};

export default AfriAIDebugMemory;
