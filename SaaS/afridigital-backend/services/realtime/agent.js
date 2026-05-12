const { assertApiVersion } = require("../runtime/safety/api.guard");
const session = require("../../core/session/engine");
const context = require("../../core/context/engine");

module.exports = {

  async route({ userId, message }){

    const userSession =
      session.get(userId);

    session.push(userId,{
      type: "message",
      value: message
    });

    const summary =
      context.summarize(
        userSession.context || []
      );

    const priority =
      context.detectPriority(message);

    let route = "general";

    if(message.includes("wallet"))
      route = "wallet";

    if(message.includes("sell"))
      route = "commerce";

    if(message.includes("earn"))
      route = "earning";

    if(priority === "high")
      route = "priority-support";

    return {

      route,

      priority,

      summary,

      live: true
    };
  }
};
