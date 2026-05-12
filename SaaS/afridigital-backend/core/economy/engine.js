const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  build(user={}){

    const activity = user.activity || [];

    return {

      trustScore: Math.min(100, activity.length * 2),

      commerceScore:
        activity.filter(x=>x.event==="commerce").length * 5,

      walletScore:
        activity.filter(x=>x.event==="wallet").length * 4,

      affiliateScore:
        activity.filter(x=>x.event==="earning").length * 5,

      supportScore:
        activity.filter(x=>x.event==="support").length * 2,

      level:
        activity.length > 20
        ? "pro"
        : "starter"
    };
  }
};
