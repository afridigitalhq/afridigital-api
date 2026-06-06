import React from "react";

export default function PageLayout({ title, subtitle, actions, children }) {
  return (
    <div className="page-layout">
      
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p style={{ opacity: 0.7 }}>{subtitle}</p>}
        </div>

        <div className="page-actions">
          {actions}
        </div>
      </div>

      <div className="page-body">
        {children}
      </div>

    </div>
  );
}
