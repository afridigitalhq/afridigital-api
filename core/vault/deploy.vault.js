let vault = [];

function vaultPR(pr) {
  pr.state = "VAULTED";
  vault.push(pr);
  return pr;
}

function releaseFromVault(prId) {
  const pr = vault.find(p => p.id === prId);
  if (!pr) throw new Error("PR not found in vault");

  pr.state = "EXECUTED";
  return pr;
}

function listVault() {
  return vault;
}

module.exports = { vaultPR, releaseFromVault, listVault };
