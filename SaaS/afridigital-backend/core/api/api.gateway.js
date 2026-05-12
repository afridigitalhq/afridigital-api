const { graph, API_VERSION } = require('../config/api.version.lock');
const axios = require("axios");

const GRAPH_VERSION = process.env.GRAPH_API_VERSION || "v23.0";
const BASE_URL = `graph("")${GRAPH_VERSION}`;

function getWhatsAppUrl(phoneNumberId) {
  return `${BASE_URL}/${phoneNumberId}/messages`;
}

async function sendWhatsAppMessage(phoneNumberId, payload) {
  const url = getWhatsAppUrl(phoneNumberId);

  return await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

module.exports = {
  sendWhatsAppMessage,
  getWhatsAppUrl,
};

const { assertApiVersion } = require('../runtime/safety/api.guard');
assertApiVersion(graph(""), 'api.gateway');
