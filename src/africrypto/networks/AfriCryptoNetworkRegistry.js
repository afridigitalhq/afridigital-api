const networks = new Map();

export const AFRI_CRYPTO_ENVIRONMENTS = Object.freeze({
  TESTNET: "TESTNET",
  MAINNET: "MAINNET"
});

export const AFRI_CRYPTO_NETWORK_FAMILIES = Object.freeze({
  EVM: "EVM",
  BITCOIN: "BITCOIN",
  SOLANA: "SOLANA"
});

const DEFAULT_NETWORKS = [
  {
    id: "ETHEREUM_SEPOLIA",
    name: "Ethereum Sepolia",
    family: "EVM",
    environment: "TESTNET",
    chainId: 11155111,
    nativeAsset: "ETH",
    enabled: true,
    receivingEnabled: true,
    transfersEnabled: true,
    adapter: "EVM"
  },
  {
    id: "BASE_SEPOLIA",
    name: "Base Sepolia",
    family: "EVM",
    environment: "TESTNET",
    chainId: 84532,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "ARBITRUM_SEPOLIA",
    name: "Arbitrum Sepolia",
    family: "EVM",
    environment: "TESTNET",
    chainId: 421614,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "OPTIMISM_SEPOLIA",
    name: "Optimism Sepolia",
    family: "EVM",
    environment: "TESTNET",
    chainId: 11155420,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "BITCOIN_TESTNET",
    name: "Bitcoin Testnet",
    family: "BITCOIN",
    environment: "TESTNET",
    chainId: null,
    nativeAsset: "BTC",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "BITCOIN"
  },
  {
    id: "SOLANA_DEVNET",
    name: "Solana Devnet",
    family: "SOLANA",
    environment: "TESTNET",
    chainId: null,
    nativeAsset: "SOL",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "SOLANA"
  },
  {
    id: "ETHEREUM",
    name: "Ethereum",
    family: "EVM",
    environment: "MAINNET",
    chainId: 1,
    nativeAsset: "ETH",
    enabled: true,
    receivingEnabled: true,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "BASE",
    name: "Base",
    family: "EVM",
    environment: "MAINNET",
    chainId: 8453,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "ARBITRUM",
    name: "Arbitrum",
    family: "EVM",
    environment: "MAINNET",
    chainId: 42161,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "OPTIMISM",
    name: "Optimism",
    family: "EVM",
    environment: "MAINNET",
    chainId: 10,
    nativeAsset: "ETH",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "EVM"
  },
  {
    id: "BITCOIN",
    name: "Bitcoin",
    family: "BITCOIN",
    environment: "MAINNET",
    chainId: null,
    nativeAsset: "BTC",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "BITCOIN"
  },
  {
    id: "SOLANA",
    name: "Solana",
    family: "SOLANA",
    environment: "MAINNET",
    chainId: null,
    nativeAsset: "SOL",
    enabled: false,
    receivingEnabled: false,
    transfersEnabled: false,
    adapter: "SOLANA"
  }
];

export function registerNetwork(network) {
  if (!network?.id) {
    throw new Error("AFRICRYPTO_NETWORK_ID_REQUIRED");
  }

  if (!network?.name) {
    throw new Error("AFRICRYPTO_NETWORK_NAME_REQUIRED");
  }

  if (!network?.family) {
    throw new Error("AFRICRYPTO_NETWORK_FAMILY_REQUIRED");
  }

  if (!network?.environment) {
    throw new Error("AFRICRYPTO_NETWORK_ENVIRONMENT_REQUIRED");
  }

  if (!Object.values(AFRI_CRYPTO_NETWORK_FAMILIES).includes(network.family)) {
    throw new Error("AFRICRYPTO_NETWORK_FAMILY_UNSUPPORTED");
  }

  if (!Object.values(AFRI_CRYPTO_ENVIRONMENTS).includes(network.environment)) {
    throw new Error("AFRICRYPTO_NETWORK_ENVIRONMENT_UNSUPPORTED");
  }

  const record = {
    id: network.id,
    name: network.name,
    family: network.family,
    environment: network.environment,
    chainId: network.chainId ?? null,
    nativeAsset: network.nativeAsset || null,
    enabled: network.enabled === true,
    receivingEnabled: network.receivingEnabled === true,
    transfersEnabled: network.transfersEnabled === true,
    adapter: network.adapter || network.family
  };

  networks.set(record.id, Object.freeze(record));
  return networks.get(record.id);
}

export function getNetwork(id) {
  return networks.get(id) || null;
}

export function listNetworks() {
  return [...networks.values()];
}

export function listNetworksByEnvironment(environment) {
  return listNetworks().filter(network => network.environment === environment);
}

export function listNetworksByFamily(family) {
  return listNetworks().filter(network => network.family === family);
}

export function getEnabledNetworks() {
  return listNetworks().filter(network => network.enabled);
}

for (const network of DEFAULT_NETWORKS) {
  registerNetwork(network);
}
