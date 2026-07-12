const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "subscription.snapshot.json");

class SubscriptionStore {

  save(snapshot) {
    fs.writeFileSync(FILE, JSON.stringify(snapshot, null, 2));
  }

  load() {
    if (!fs.existsSync(FILE)) {
      return {};
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  }

}

module.exports = new SubscriptionStore();
