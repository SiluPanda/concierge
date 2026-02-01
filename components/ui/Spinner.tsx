import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  borderWidth?: number;
}

export function Spinner({ size = 24, color = '#6366f1', borderWidth = 3 }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid rgba(255,255,255,0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

// Add animation keyframes globally if not present, or rely on tailwind 'animate-spin' class usage in other components
// Here we use inline style animation for simplicity as per docs
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);