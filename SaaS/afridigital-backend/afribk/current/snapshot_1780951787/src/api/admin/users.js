const User = require("../../db/models/User");

module.exports = async (req, res) => {
  const users = await User.getAllUsers();
  res.json({
    total: users.length,
    users
  });
};
