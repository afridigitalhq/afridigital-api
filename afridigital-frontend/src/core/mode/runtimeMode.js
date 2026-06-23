export const RUNTIME_MODE = process.env.REACT_APP_MODE || "rest";

export const isRestMode = RUNTIME_MODE === "rest";
export const isRealtimeMode = RUNTIME_MODE === "realtime";
