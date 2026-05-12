const { assertApiVersion } = require("../runtime/safety/api.guard");
const events = {};

module.exports = {
  on: (event, fn) => {
    events[event] = events[event] || [];
    events[event].push(fn);
  },
  emit: async (event, data) => {
    console.log("📡 EVENT:", event);
    (events[event] || []).forEach(fn => fn({ data }));
  }
};
