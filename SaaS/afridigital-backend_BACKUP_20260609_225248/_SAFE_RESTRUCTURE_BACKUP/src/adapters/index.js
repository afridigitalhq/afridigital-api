const mode = process.env.MODE || "mock";

const whatsapp = require("./whatsapp/" + mode + ".js");

module.exports = {
  whatsapp
};
