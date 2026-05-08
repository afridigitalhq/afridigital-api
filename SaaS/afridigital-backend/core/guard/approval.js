module.exports = {
  approve: (result) => {
    console.log("🛡️ Guard evaluating:", result);
    return result.success === true;
  }
};
