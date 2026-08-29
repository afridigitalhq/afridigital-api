import AfriPredictionAdapterRegistry from "../registry/AfriPredictionAdapterRegistry.js";

export function registerAfriPredictionAdapter(adapter) {
  if (!adapter?.name) throw new Error("Invalid Afri prediction adapter");
  return AfriPredictionAdapterRegistry.has(adapter.name)
    ? AfriPredictionAdapterRegistry.get(adapter.name)
    : AfriPredictionAdapterRegistry.register(adapter);
}

export default AfriPredictionAdapterRegistry;
