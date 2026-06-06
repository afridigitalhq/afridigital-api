import React from "react";
import BaseWidget from "./_BaseWidget";

export default function JobsWidget() {
  return (
    <BaseWidget title="💼 Jobs">
      <div>Recommended Jobs</div>
      <div style={{ opacity: 0.7 }}>No active listings</div>
    </BaseWidget>
  );
}
