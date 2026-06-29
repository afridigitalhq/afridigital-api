const cmd = process.argv[2];

switch(cmd) {
  case "boot":
    require("./boot");
    break;
  case "validate":
    require("./validate");
    break;
  case "deploy":
    require("./deploy");
    break;
  default:
    console.log("Usage: node bootstrap/cli <boot|validate|deploy>");
}
