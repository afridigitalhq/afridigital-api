import registry from "./modules/afriai/providers/bootstrap.js";

const provider = registry.get("ollama");

if (!provider) {
  console.log({
    provider: "ollama",
    status: "NOT_REGISTERED"
  });
  process.exit(0);
}

try {
  const health = await provider.health();
  console.log({
    provider: provider.name,
    health
  });
} catch (e) {
  console.log({
    provider: provider.name,
    status: "FAILED",
    error: e.message
  });
}
