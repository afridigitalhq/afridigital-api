const fs = require("fs");

async function exportAll() {
  return {
    status: "ok",
    message: "export service active (placeholder safe mode)",
    timestamp: Date.now()
  };
}

module.exports = { exportAll };
