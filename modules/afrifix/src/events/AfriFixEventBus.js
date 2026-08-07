export function emitAfriFixEvent(event) {
  return {
    source: "AfriFix",
    event,
    timestamp: new Date().toISOString()
  };
}
