import { AfriProducts } from "../registry/ProductRegistry.js";

export function createProductPluginMap(plugins = {}){
  const map = {};

  for (const product of AfriProducts){
    const key = product.key;

    map[key] = {
      product,
      plugin: plugins[key] || null,
      active: !!plugins[key]
    };
  }

  console.log("🔗 Product–Plugin Map Generated:", Object.keys(map).length);

  return map;
}
