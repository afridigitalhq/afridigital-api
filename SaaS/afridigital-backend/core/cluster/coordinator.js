const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  route: (event) => {
    console.log("🌐 Routing event:", event.type);

    if (event.type.includes("WHATSAPP")) return "NODE_A";
    if (event.type.includes("WEB")) return "NODE_B";
    return "NODE_C";
  }
};
