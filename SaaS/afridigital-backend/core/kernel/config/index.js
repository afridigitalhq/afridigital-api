const loader = require('./loader');

module.exports = {
  get: loader.get,
  raw: loader.raw || {}
};
