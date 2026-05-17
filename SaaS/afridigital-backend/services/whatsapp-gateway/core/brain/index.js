const path = require('path');
const v3 = require(path.resolve(__dirname, '../../../../core/brain/v3'));

module.exports = {
  processMessage: async (req, res) => {
    return await v3.processMessage(req, res);
  }
};
