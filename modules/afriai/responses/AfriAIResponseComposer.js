const AfriAIResponseComposer = {

  compose(result){

    return {
      response:
        result?.execution?.response ||
        "Hello 👋 I'm AfriAI. How can I help you today?",

      status:"RESPONSE_READY",
      source:"AfriAIResponseComposer"
    };

  }

};

export default AfriAIResponseComposer;
