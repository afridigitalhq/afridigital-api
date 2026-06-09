const keys = {
  "ak_demo_123": { tenant: "demo" }
};

function verify(apiKey) {
  return keys[apiKey] || null;
}

module.exports = { verify };
