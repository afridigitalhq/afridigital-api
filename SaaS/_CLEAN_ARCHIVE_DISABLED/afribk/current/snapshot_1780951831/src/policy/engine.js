const { can } = require("../auth/roles");

function authorize(user, action) {
  if (!can(user.role, action)) {
    throw new Error("ACCESS_DENIED");
  }
  return true;
}

module.exports = { authorize };
