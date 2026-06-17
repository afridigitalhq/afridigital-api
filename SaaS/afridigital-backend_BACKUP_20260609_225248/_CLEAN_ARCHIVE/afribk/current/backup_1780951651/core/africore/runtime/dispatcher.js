const guard = require('../hardening/guard');
const kernel = require("./kernel");

module.exports = {
  async dispatch(event) {
    return await kernel.run(event);
  }
};
