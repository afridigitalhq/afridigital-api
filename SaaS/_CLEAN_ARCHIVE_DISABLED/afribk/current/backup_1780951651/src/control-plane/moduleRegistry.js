const allowedFolders = new Set([
  "src/api",
  "src/db",
  "src/auth",
  "src/middleware",
  "core/ai"
]);

const allowedExact = new Set([
  "core/ai/gateway/v5/plugins/whatsapp/cloud/whatsappCloudAdapter.js",
  "core/ai/gateway/v5/plugins/whatsapp/cloud/whatsappCloudAdapterV2.js",
  "core/ai/gateway/v5/plugins/whatsapp/cloud/whatsappCloudTransport.js"
]);

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function isAllowed(filePath) {
  const p = normalize(filePath);

  if (allowedExact.has(p)) return true;

  for (const folder of allowedFolders) {
    if (p.startsWith(folder)) return true;
  }

  return false;
}

module.exports = { isAllowed };
