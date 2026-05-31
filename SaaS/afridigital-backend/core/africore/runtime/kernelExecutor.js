const kernel = require('./kernel');

module.exports = async function execute(payload) {
  try {
    return await kernel.run(payload);
  } catch (e) {
    return {
      ok: false,
      error: e.message
    };
  }
};
