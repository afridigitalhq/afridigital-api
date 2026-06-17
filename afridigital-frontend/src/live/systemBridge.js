export function createSystemBridge(setState) {
  return {
    updateAPI(status) {
      setState(s => ({ ...s, apiStatus: status }));
    },
    updateWS(status) {
      setState(s => ({ ...s, wsStatus: status }));
    }
  };
}
