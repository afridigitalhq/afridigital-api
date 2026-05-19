const { assertApiVersion } = require("../runtime/safety/api.guard");
const axios = require('axios');

const BASE = 'https://afridigital-api.onrender.com/api';

async function getSystem() {
  const res = await axios.get(`${BASE}/system`);
  return res.data;
}

async function getControl() {
  const res = await axios.get(`${BASE}/control`);
  return res.data;
}

async function getDashboard() {
  const res = await axios.get(`${BASE}/dashboard`);
  return res.data;
}

module.exports = {
  getSystem,
  getControl,
  getDashboard
};
