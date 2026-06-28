const axios = require("axios");

const CI_URL = "https://afridigital-api.onrender.com/api/ci/evaluate";

async function evaluateDeployRequest(message, role = "VIEWER") {
  const ci = await axios.get(CI_URL).then(r => r.data);

  const approved = ci.deploy && (role === "ADMIN" || role === "DEPLOYER");

  return {
    approved,
    ci,
    message
  };
}

module.exports = { evaluateDeployRequest };
