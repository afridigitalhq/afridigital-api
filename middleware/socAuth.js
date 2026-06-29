export function socAuth(req, res, next) {
  const user = req.user; // assumed JWT decoded earlier

  const allowedRoles = ["admin", "soc_operator", "soc_super"];

  if (!user || !allowedRoles.includes(user.role)) {
    return res.status(403).json({
      error: "SOC_ACCESS_DENIED"
    });
  }

  next();
}
