module.exports = {
  approve: (result) => {
    console.log("🛡️ Gate check:", result);
    return result.safe === true;
  }
};
