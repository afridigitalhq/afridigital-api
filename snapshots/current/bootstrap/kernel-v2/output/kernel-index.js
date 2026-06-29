const { createKernel } = require("./createKernel");

module.exports = createKernel(process.env || {});
