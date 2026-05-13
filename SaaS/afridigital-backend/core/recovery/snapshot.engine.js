const fs = require("fs");

class SnapshotEngine {
  save(name, data) {
    fs.writeFileSync(
      "./snapshots_" + name + ".json",
      JSON.stringify(data, null, 2)
    );
  }

  load(name) {
    const file = "./snapshots_" + name + ".json";

    if (!fs.existsSync(file)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(file));
  }
}

module.exports = new SnapshotEngine();
