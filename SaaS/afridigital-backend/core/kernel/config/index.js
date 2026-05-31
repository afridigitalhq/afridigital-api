
const loader = require('./loader');

module.exports = {
  get: () => loader,
  raw: loader
};
