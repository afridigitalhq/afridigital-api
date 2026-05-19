const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  transfer: ({ from, to, amount }) => {
    return {
      ok: true,
      txId: "TX-" + Date.now(),
      amount
    };
  }
};
