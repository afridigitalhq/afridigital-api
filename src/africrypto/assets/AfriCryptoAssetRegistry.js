const assets = new Map();

export function registerAsset(asset) {
  if (!asset?.id) throw new Error("AFRICRYPTO_ASSET_ID_REQUIRED");
  if (!asset?.assetType) throw new Error("AFRICRYPTO_ASSET_TYPE_REQUIRED");
  if (!asset?.network) throw new Error("AFRICRYPTO_ASSET_NETWORK_REQUIRED");

  const record = {
    id: asset.id,
    assetType: asset.assetType,
    network: asset.network,
    symbol: asset.symbol || null,
    name: asset.name || null,
    contractAddress: asset.contractAddress || null,
    tokenId: asset.tokenId ?? null,
    standard: asset.standard || null,
    decimals: asset.decimals ?? null,
    metadataUri: asset.metadataUri || null,
    mediaUri: asset.mediaUri || null,
    verified: asset.verified === true
  };

  assets.set(record.id, Object.freeze(record));
  return assets.get(record.id);
}

export function getAsset(id) {
  return assets.get(id) || null;
}

export function listAssets() {
  return [...assets.values()];
}
