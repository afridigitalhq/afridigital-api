const path = require("path");

class RequestContext {
  constructor(fromFile, request) {
    this.fromFile = fromFile;
    this.request = request;
    this.fromDomain = this.resolveDomain(fromFile);
    this.toDomain = this.resolveRequestDomain(request, fromFile);
    this.id = Date.now() + Math.random().toString(16).slice(2);
  }

  resolveDomain(file) {
    if (!file) return "system";
    if (file.includes("/whatsapp")) return "whatsapp";
    if (file.includes("/africore")) return "africore";
    if (file.includes("/agents")) return "agents";
    if (file.includes("/integrations")) return "integrations";
    return "system";
  }

  resolveRequestDomain(req, parent) {
    if (!req || (!req.startsWith(".") && !req.startsWith("/"))) return "external";

    try {
      const resolved = path.resolve(path.dirname(parent || ""), req);
      if (resolved.includes("/whatsapp")) return "whatsapp";
      if (resolved.includes("/africore")) return "africore";
      if (resolved.includes("/agents")) return "agents";
      if (resolved.includes("/integrations")) return "integrations";
      return "internal";
    } catch {
      return "internal";
    }
  }
}

function enforce(ctx) {
  if (ctx.toDomain === "external") return;
  if (ctx.toDomain === "internal") return;

  if (ctx.fromDomain !== ctx.toDomain) {
    throw new Error(
      "V18.2_SANDBOX_BLOCK: " + ctx.fromDomain + " → " + ctx.toDomain
    );
  }
}

module.exports = { RequestContext, enforce };
