function getWallet(user) {
  return {
    balance: user.wallet || 0
  };
}

module.exports = { getWallet };
