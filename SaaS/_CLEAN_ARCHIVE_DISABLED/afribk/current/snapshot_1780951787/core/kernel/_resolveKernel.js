const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

module.exports = {
  root: ROOT,
  config: require('./config').get()
};
