const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  build(ad) {

    if(!ad) return null;

    return {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text:
`${ad.title}

${ad.body}`
        },
        action: {
          buttons: ad.buttons.map((b, i) => ({
            type: "reply",
            reply: {
              id: "sponsor_" + i,
              title: b.slice(0,20)
            }
          }))
        }
      }
    };
  }
};
