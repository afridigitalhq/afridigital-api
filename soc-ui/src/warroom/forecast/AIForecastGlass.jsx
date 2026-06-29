import React from "react";

export default function AIForecastGlass() {
  return (
    <div className="forecast-glass-panel">
      <h3>🧠 AfriDigital AI Forecast</h3>
      <div className="forecast-metric">
        Risk: <span className="red-pulse">LOW → MEDIUM SPIKE</span>
      </div>
      <div className="forecast-metric">
        System Load: {Math.floor(Math.random() * 100)}%
      </div>
    </div>
  );
}
