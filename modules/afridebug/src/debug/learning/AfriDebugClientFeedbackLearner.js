const feedback=[];

const AfriDebugClientFeedbackLearner = {

  record(input={}){

    const entry = {

      feedbackId:
        `FEEDBACK-${Date.now()}`,

      deliveryId:
        input.deliveryId || null,

      clientStatus:
        input.clientStatus || "unknown",

      issue:
        input.issue || null,

      reopened:
        input.reopened || false,

      outcome:
        input.outcome || "unknown",

      learningReady:
        true,

      createdAt:
        Date.now()

    };

    feedback.push(entry);

    return entry;

  },


  list(){

    return [...feedback];

  },


  search(issue){

    return feedback.filter(
      item=>item.issue===issue
    );

  },


  health(){

    return {
      service:"AfriDebugClientFeedbackLearner",
      status:"healthy",
      feedback:feedback.length
    };

  }

};


export default AfriDebugClientFeedbackLearner;
