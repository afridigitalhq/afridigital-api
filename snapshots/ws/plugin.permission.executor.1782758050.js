const registry = require("../manifest/manifest.registry");
const permissions = require("../security/permission.engine");

class PluginPermissionExecutor {

  start() {

    const verified = [];
    const rejected = [];

    registry.list().forEach(plugin => {

      const result = {
        id: plugin.id,
        permissions: plugin.permissions || []
      };

      if (result.permissions.length > 0) {
        verified.push(result);
      } else {
        rejected.push(result.id);
      }

    });

    return {
      ok: rejected.length === 0,
      verified,
      rejected,
      total: verified.length,
      ts: Date.now()
    };

  }

}

module.exports = new PluginPermissionExecutor();
