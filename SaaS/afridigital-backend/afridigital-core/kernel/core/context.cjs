const bus = require("../../afridigital-core/kernel/event-bus/bus.cjs");

const state = {
  flow: "init",
  build: "init"
};

const services = {
  frontend: "srv-d7st7sugkk3c73dl004g",
  backend: "srv-d7stmedckfvc73cp73i0"
};

module.exports = { bus, state, services };
