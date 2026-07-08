import fs from "fs";
import path from "path";

export async function loadPlugins(dir = "./src/plugins"){
  const plugins = {};

  if (!fs.existsSync(dir)) return plugins;

  const files = fs.readdirSync(dir);

  for (const file of files){
    const fullPath = path.join(dir, file);

    try {
      const mod = await import(fullPath);

      const plugin = mod.default || Object.values(mod)[0];
      if (plugin?.name){
        plugins[plugin.name] = plugin;
      }
    } catch (e){
      console.log("⚠️ Plugin load failed:", file);
    }
  }

  console.log("📦 Plugins Loaded:", Object.keys(plugins).length);

  return plugins;
}
