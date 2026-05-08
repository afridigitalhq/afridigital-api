module.exports = {
  allowFinancialChange: false,
  allowAuthChange: false,
  allowAutoDeploy: false,

  validate(action) {
    if (action.type === "FINANCIAL") return false;
    if (action.type === "AUTH") return false;
    return true;
  }
};
