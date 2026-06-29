const { ControlPlaneBridge } = require("./adapter/soc.bridge");

const controlPlane = new ControlPlaneBridge();

module.exports = { controlPlane };
