const Module = require("module");

const original = Module._load;

Module._load = function(req, parent, isMain) {
  // minimal containment hook (safe mode)
  if (parent && parent.filename && parent.filename.includes("/whatsapp") && req.includes("../africore")) {
    throw new Error("V18.3_CONTAINMENT_BLOCK: whatsapp → africore forbidden");
  }

  return original.apply(this, arguments);
};
