const { assertApiVersion } = require("../runtime/safety/api.guard");
const API_VERSION = "v23.0";

const GRAPH_BASE = `graph("")${API_VERSION}`;

function graph(endpoint = "") {
  return `${GRAPH_BASE}/${endpoint}`;
}

module.exports = {
  API_VERSION,
  GRAPH_BASE,
  graph
};
