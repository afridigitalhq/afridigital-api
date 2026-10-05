const wallets = new Map();

const DEFAULT_POLICY = Object.freeze({
  enabled: true,
  sendingEnabled: true,
  receivingEnabled: true,
  sendLimits: Object.freeze({
    perTransaction: null,
    daily: null
  }),
  receiveLimits: Object.freeze({
    perTransaction: null,
    daily: null
  })
});

function normalizeLimits(limits, fallback) {
  return Object.freeze({
    perTransaction: limits?.perTransaction ?? fallback.perTransaction,
    daily: limits?.daily ?? fallback.daily
  });
}

function normalizePolicy(policy = {}) {
  return Object.freeze({
    enabled: policy.enabled ?? DEFAULT_POLICY.enabled,
    sendingEnabled:
      policy.sendingEnabled ?? DEFAULT_POLICY.sendingEnabled,
    receivingEnabled:
      policy.receivingEnabled ?? DEFAULT_POLICY.receivingEnabled,

    sendLimits: normalizeLimits(
      policy.sendLimits,
      DEFAULT_POLICY.sendLimits
    ),

    receiveLimits: normalizeLimits(
      policy.receiveLimits,
      DEFAULT_POLICY.receiveLimits
    )
  });
}

export function registerWallet(wallet) {
  if (!wallet?.id) {
    throw new Error("AFRICRYPTO_WALLET_ID_REQUIRED");
  }

  if (!wallet?.ownerId) {
    throw new Error("AFRICRYPTO_WALLET_OWNER_REQUIRED");
  }

  if (!wallet?.agentId) {
    throw new Error("AFRICRYPTO_WALLET_AGENT_REQUIRED");
  }

  const addresses = Array.isArray(wallet.addresses)
    ? wallet.addresses.map(address => Object.freeze({
        networkId: address.networkId || null,
        networkFamily: address.networkFamily || null,
        environment: address.environment || null,
        address: address.address || null
      }))
    : [];

  const record = {
    id: wallet.id,
    ownerId: wallet.ownerId,
    agentId: wallet.agentId,
    name: wallet.name || "AfriCrypto Wallet",
    status: wallet.status || "ACTIVE",

    policy: normalizePolicy(wallet.policy),

    addresses,

    createdAt: wallet.createdAt || new Date().toISOString()
  };

  wallets.set(record.id, Object.freeze(record));

  return wallets.get(record.id);
}

export function getWallet(id) {
  return wallets.get(id) || null;
}

export function getWalletByAgentId(agentId) {
  if (!agentId || typeof agentId !== "string" || !agentId.trim()) {
    throw new Error("AFRICRYPTO_WALLET_AGENT_REQUIRED");
  }

  const matches = [...wallets.values()].filter(
    wallet => wallet.agentId === agentId.trim()
  );

  if (matches.length > 1) {
    throw new Error("AFRICRYPTO_MULTIPLE_WALLETS_FOR_AGENT");
  }

  return matches[0] || null;
}

export function listWallets() {
  return [...wallets.values()];
}

export function getWalletAddress(
  walletId,
  networkId,
  environment = null
) {
  const wallet = getWallet(walletId);

  if (!wallet) {
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  return wallet.addresses.find(address =>
    address.networkId === networkId &&
    (environment === null || address.environment === environment)
  ) || null;
}

export function listWalletAddresses(walletId) {
  const wallet = getWallet(walletId);

  if (!wallet) {
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  return [...wallet.addresses];
}
