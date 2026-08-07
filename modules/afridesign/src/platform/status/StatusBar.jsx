import React from 'react';

export const StatusBar = () => {
  return (
    <div className="status-bar" style={{
      height: '28px',
      background: '#1e1e1e',
      color: '#cccccc',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      fontSize: '12px',
      borderTop: '1px solid #333'
    }}>
      <span>✓ Ready</span>
      <span style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
        <span>Ln 1 | Col 1</span>
        <span>UTF-8</span>
      </span>
    </div>
  );
};

export default StatusBar;
