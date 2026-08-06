const AfriAIRuntimeEvidenceCollector = {

  collect(input = {}){

    const response =
      input.response ||
      input.data?.response?.reply ||
      input.data?.reply ||
      "";

    const question =
      input.question ||
      input.message ||
      "";

    return {

      source: "AfriAI Runtime",

      knowledge: {

        question,

        response

      },

      metadata: {

        endpoint:
          input.endpoint || null,

        channel:
          input.channel || "Web",

        timestamp:
          Date.now()

      }

    };

  }

};

export default AfriAIRuntimeEvidenceCollector;
