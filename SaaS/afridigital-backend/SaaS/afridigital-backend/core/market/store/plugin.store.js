const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function installPlugin(plugin) {

  const store =
    db.read('plugin.store.json');

  store.push({
    name: plugin.name,
    price: plugin.price || 0,
    active: true,
    installs: 1,
    revenue: 0,
    timestamp: Date.now()
  });

  db.write('plugin.store.json', store);
}

function listPlugins() {

  return db.read('plugin.store.json');
}

module.exports = {
  installPlugin,
  listPlugins
};
