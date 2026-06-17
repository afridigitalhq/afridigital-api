const path = require('path');

global.__root = path.resolve(__dirname, '../../');

module.exports = global.__root;
