const { verify } = require("../verify/systemVerifier");

if(process.argv.includes("verify")){
  verify();
} else {
  console.log("Usage: node core/verify/cli.js verify");
}
