const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  build(buttons = []) {
    return buttons.map((btn, i) => ({
      type: "reply",
      reply: {
        id: "btn_" + i,
        title: btn.slice(0, 20)
      }
    }));
  }
};
