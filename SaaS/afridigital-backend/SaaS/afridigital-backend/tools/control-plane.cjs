const dashboard = require("./whatsapp-dashboard.cjs");

function handleCommand(cmd){
  switch(cmd){
    case "status":
      return dashboard.run();

    case "modules":
      return dashboard.run();

    default:
      return "❓ Unknown command. Try: status | modules";
  }
}

module.exports = { handleCommand };
