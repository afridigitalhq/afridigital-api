export function runtimeHealth() {
  return {
    status: "healthy",
    bootstrap: "online",
    events: "online",
    kernelProbe: "detected",
    legacy: "safe-mode",
    timestamp: new Date().toISOString()
  };
}
