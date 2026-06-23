export const MODE = process.env.REACT_APP_MODE || "REST";
export const isLive = () => MODE === "LIVE";
export const isRest = () => MODE !== "LIVE";
