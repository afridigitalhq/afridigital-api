const fs = require("fs");
const path = require("path");

class DurableJournal {
  constructor() {
    this.file = path.join(__dirname, "journal.log");
  }

  append(event) {
    fs.appendFileSync(
      this.file,
      JSON.stringify(event) + "\n"
    );
  }

  readAll() {
    if (!fs.existsSync(this.file)) {
      return [];
    }

    return fs
      .readFileSync(this.file, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse);
  }
}

module.exports = new DurableJournal();
