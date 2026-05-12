const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  summarize(history=[]){

    return history
      .slice(0,5)
      .map(x => `[${x.type}] ${x.value}`)
      .join(" | ");
  },

  detectPriority(text=""){

    text = text.toLowerCase();

    if(
      text.includes("payment") ||
      text.includes("failed") ||
      text.includes("urgent")
    ){
      return "high";
    }

    return "normal";
  }
};
