const axios = require('axios');

const BASE = 'http://localhost:3000/api';

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
