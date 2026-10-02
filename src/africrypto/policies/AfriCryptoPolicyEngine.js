import { getWallet } from "../wallets/AfriCryptoWalletRegistry.js";
import { getNetwork } from "../networks/AfriCryptoNetworkRegistry.js";
import { getDailyUsage } from "./AfriCryptoUsageStore.js";

export function evaluatePolicy({
  allowed = true,
  assetType = null,
  network = null,
  amount = null,
  maxAmount = null,
  requiresApproval = false,
  approved = false
} = {}) {
  if (!allowed) {
    return { allowed: false, reason: "POLICY_DENIED" };
  }

  if (
    maxAmount !== null &&
    amount !== null &&
    Number(amount) > Number(maxAmount)
  ) {
    return {
      allowed: false,
      reason: "AMOUNT_LIMIT_EXCEEDED"
    };
  }

  if (requiresApproval && !approved) {
    return {
      allowed: false,
      reason: "HUMAN_APPROVAL_REQUIRED",
      assetType,
      network
    };
  }

  return {
    allowed: true,
    reason: "POLICY_ALLOWED",
    assetType,
    network
  };
}

function evaluateWalletDirection({walletId,direction,networkId,amount=null}={}) {
  const wallet=getWallet(walletId);
  if (!wallet) return {allowed:false,reason:"WALLET_NOT_FOUND"};

  if (wallet.status!=="ACTIVE" || wallet.policy.enabled!==true)
    return {allowed:false,reason:"WALLET_DISABLED",walletId};

  const network=getNetwork(networkId);
  if (!network)
    return {allowed:false,reason:"NETWORK_NOT_FOUND",networkId};

  const numericAmount=amount===null ? null : Number(amount);

  if (numericAmount!==null && (!Number.isFinite(numericAmount) || numericAmount<0))
    return {allowed:false,reason:"INVALID_AMOUNT",walletId,networkId,amount};

  if (direction==="SEND") {
    if (wallet.policy.sendingEnabled!==true)
      return {allowed:false,reason:"WALLET_SENDING_DISABLED",walletId};

    if (network.transfersEnabled!==true)
      return {allowed:false,reason:"NETWORK_TRANSFER_DISABLED",networkId};

    const limit=wallet.policy.sendLimits.perTransaction;
    if (limit!==null && numericAmount!==null && numericAmount>Number(limit))
      return {allowed:false,reason:"SEND_LIMIT_EXCEEDED",walletId,networkId,amount,limit};

    const dailyLimit=wallet.policy.sendLimits.daily;
    if (dailyLimit!==null && numericAmount!==null) {
      const dailyUsage=getDailyUsage(walletId,networkId);
      if (dailyUsage+numericAmount>Number(dailyLimit))
        return {
          allowed:false,
          reason:"SEND_DAILY_LIMIT_EXCEEDED",
          walletId,
          networkId,
          amount,
          dailyUsage,
          dailyLimit
        };
    }
  }

  if (direction==="RECEIVE") {
    if (wallet.policy.receivingEnabled!==true)
      return {allowed:false,reason:"WALLET_RECEIVING_DISABLED",walletId};

    if (network.receivingEnabled!==true)
      return {allowed:false,reason:"NETWORK_RECEIVING_DISABLED",networkId};

    const limit=wallet.policy.receiveLimits.perTransaction;
    if (limit!==null && numericAmount!==null && numericAmount>Number(limit))
      return {allowed:false,reason:"RECEIVE_LIMIT_EXCEEDED",walletId,networkId,amount,limit};

    const dailyLimit=wallet.policy.receiveLimits.daily;
    if (dailyLimit!==null && numericAmount!==null) {
      const dailyUsage=getDailyUsage(walletId,networkId);
      if (dailyUsage+numericAmount>Number(dailyLimit))
        return {
          allowed:false,
          reason:"RECEIVE_DAILY_LIMIT_EXCEEDED",
          walletId,
          networkId,
          amount,
          dailyUsage,
          dailyLimit
        };
    }
  }

  return {
    allowed:true,
    reason:"WALLET_POLICY_ALLOWED",
    walletId,
    networkId,
    direction,
    amount
  };
}

export function evaluateSendPolicy(options = {}) {
  return evaluateWalletDirection({
    ...options,
    direction: "SEND"
  });
}

export function evaluateReceivePolicy(options = {}) {
  return evaluateWalletDirection({
    ...options,
    direction: "RECEIVE"
  });
}
