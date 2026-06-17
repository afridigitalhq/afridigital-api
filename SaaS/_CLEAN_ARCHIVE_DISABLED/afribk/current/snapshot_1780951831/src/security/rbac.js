const jwt = require("jsonwebtoken");

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function authorize(role) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = verifyToken(token || "");

      if (!user || user.role !== role) {
        return res.status(403).json({ error: "ACCESS_DENIED" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ error: "INVALID_TOKEN" });
    }
  };
}

module.exports = { authorize };
