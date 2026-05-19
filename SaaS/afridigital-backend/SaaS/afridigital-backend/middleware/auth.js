const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, 'SECRET');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
