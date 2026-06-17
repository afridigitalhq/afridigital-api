const keys = new Map([
  ["ak_demo_123", { tenantId: "tnt_demo", status: "active" }]
]);

function validate(key) {
  return keys.get(key);
}

module.exports = { validate };
