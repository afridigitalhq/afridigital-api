const roles = {
  FRAUD: "fraud",
  SUPPORT: "support",
  SALES: "sales",
  ANALYTICS: "analytics",
  ADMIN: "admin"
};

function classify(msg) {
  const text = (msg.text || "").toLowerCase();

  if (text.startsWith("admin:") || text.startsWith("/admin")) {
    return roles.ADMIN;
  }

  if (text.includes("refund") || text.includes("scam") || text.includes("hack")) {
    return roles.FRAUD;
  }

  if (text.includes("price") || text.includes("buy") || text.includes("how much")) {
    return roles.SALES;
  }

  if (text.includes("help") || text.includes("issue") || text.includes("problem")) {
    return roles.SUPPORT;
  }

  return roles.ANALYTICS;
}

module.exports = { roles, classify };
