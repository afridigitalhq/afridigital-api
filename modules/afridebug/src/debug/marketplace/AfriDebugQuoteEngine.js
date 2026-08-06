const quotes = [];

const AfriDebugQuoteEngine = {

  create(job = {}) {

    const complexity =
      job.category === "BUILD_FAILURE"
        ? "HIGH"
        : "NORMAL";

    const quote = {

      id:`QUOTE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      jobId:job.id || null,

      service:"FULL_DEBUG_INVESTIGATION",

      complexity,

      includes:[
        "repository-analysis",
        "runtime-inspection",
        "patch-planning",
        "verification",
        "evidence-report"
      ],

      pricing:{
        currency:"AfriCoin",
        amount: complexity==="HIGH" ? 250 : 100
      },

      status:"PENDING_APPROVAL",

      createdAt:Date.now()
    };

    quotes.push(quote);

    return quote;
  },


  approve(id){

    const quote = quotes.find(
      x=>x.id===id
    );

    if(!quote){
      return {
        success:false,
        reason:"QUOTE_NOT_FOUND"
      };
    }

    quote.status="APPROVED";

    return {
      success:true,
      quote
    };
  },


  list(){
    return quotes;
  },


  stats(){
    return {
      quotes:quotes.length
    };
  }

};

export default AfriDebugQuoteEngine;
