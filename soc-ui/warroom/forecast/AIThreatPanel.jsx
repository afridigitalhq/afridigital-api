import React from "react";

export default function AIThreatPanel() {
  return (
    <div className="absolute top-10 right-10 w-72 bg-red-950/30 border border-red-600 p-3 rounded-xl backdrop-blur-xl">
      <div className="text-red-400 font-bold">AI Threat Forecast</div>
      <div className="text-xs mt-2">
        - anomaly probability: 0.32  
        - attack vector: unknown  
        - confidence drift: rising  
      </div>
    </div>
  );
}
