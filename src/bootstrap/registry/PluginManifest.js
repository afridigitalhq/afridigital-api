export const PluginManifest = {
    type: "security",
    version: "1.0.0",
    monetizable: true,
    category: "surveillance"
  },
  AfriTracker: {
    name: "AfriTracker",
    type: "location",
    version: "1.0.0",
    monetizable: true,
    category: "logistics"
  },
  AfriTicking: {
    name: "AfriTicking",
    type: "events",
    version: "1.0.0",
    monetizable: true,
    category: "ticketing"
  }
};

export function getPluginMeta(key) {
  return PluginManifest[key] || {
    name: key,
    type: "unknown",
    version: "0.0.0",
    monetizable: false,
    category: "unclassified"
  };
}
