const knowledge=[];

const AfriDebugAILearningEngine={

  learn(input={}){

    const record={

      id:`LEARN-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:input.investigationId||null,

      rootCause:input.rootCause||"UNKNOWN",

      resolution:input.resolution||"UNKNOWN",

      confidence:input.confidence??1.0,

      reusable:true,

      learnedAt:Date.now()

    };

    knowledge.push(record);

    return record;

  },

  search(query=""){

    return knowledge.filter(x=>
      (x.rootCause||"").toLowerCase().includes(query.toLowerCase()) ||
      (x.resolution||"").toLowerCase().includes(query.toLowerCase())
    );

  },

  list(){

    return knowledge;

  },

  stats(){

    return{

      learnedCases:knowledge.length

    };

  }

};

export default AfriDebugAILearningEngine;
