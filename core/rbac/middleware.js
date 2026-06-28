const { can } = require("./roles");

function rbac(action) {
  return (req, res, next) => {
    const role = req.headers["x-role"] || "VIEWER";
    if (!can(role, action)) {
      return res.status(403).json({ error: "RBAC_DENIED", role });
    }
    next();
  };
}

module.exports = { rbac };
