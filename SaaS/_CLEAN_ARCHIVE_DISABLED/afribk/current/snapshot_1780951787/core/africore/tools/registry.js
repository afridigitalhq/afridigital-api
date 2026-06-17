const fs = require('fs');
const path = require('path');

const plugins = new Map();

/**
 * Register tool dynamically
 */
function register(name, fn){
  plugins.set(name, fn);
}

/**
 * Load all plugins in /plugins
 */
function loadPlugins(){
  const dir = path.join(__dirname, 'plugins');
  if(!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach(file => {
    const tool = require(path.join(dir, file));
    if(tool.name && tool.run){
      register(tool.name, tool.run);
    }
  });
}

/**
 * Execute tool safely
 */
async function run(name, payload, ctx){
  const tool = plugins.get(name);

  if(!tool){
    return {
      ok: false,
      error: `Tool not found: ${name}`
    };
  }

  try {
    return await tool(payload, ctx);
  } catch (e){
    return {
      ok: false,
      error: e.message
    };
  }
}

module.exports = {
  register,
  loadPlugins,
  run
};
