const { assertApiVersion } = require("../runtime/safety/api.guard");
class OpportunityRouter {

  detectIntent(message = "") {

    const text = message.toLowerCase();

    if (
      text.includes("earn") ||
      text.includes("job") ||
      text.includes("task")
    ) {
      return "task";
    }

    if (
      text.includes("promote") ||
      text.includes("advert") ||
      text.includes("boost")
    ) {
      return "ad";
    }

    return "general";
  }

}

module.exports = new OpportunityRouter();
