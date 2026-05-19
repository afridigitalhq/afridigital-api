const { assertApiVersion } = require("../runtime/safety/api.guard");
class MarketAdapter {
  snapshot() {
    return { status: "IDLE_SAFE_MODE" };
  }
}
module.exports = new MarketAdapter();
