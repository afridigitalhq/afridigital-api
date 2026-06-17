const { MODE } = require('../config/mode');

function getBootConfig() {
  switch (MODE) {
    case "dev-mock":
      return {
        primary: "mock",
        allowRemote: false,
        allowOllama: false
      };

    case "dev-local":
      return {
        primary: "mock",
        allowRemote: false,
        allowOllama: true
      };

    case "prod":
      return {
        primary: "openai",
        allowRemote: true,
        allowOllama: false
      };

    default:
      throw new Error("Unknown boot mode");
  }
}

module.exports = { getBootConfig };
