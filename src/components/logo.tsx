import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center" title="Nityholiday">
      <svg
        width="36"
        height="36"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <defs>
          <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FDB813', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F26D21', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#sunset)" />
        <path
          d="M60,90 C40,90 20,80 10,60 C30,60 40,70 60,70 C70,70 80,65 90,60 C80,80 70,90 60,90 Z"
          fill="#2C3E50" 
        />
        <path 
          d="M30 70 C 25 60, 20 50, 20 40 L 25 40 C 25 50, 30 60, 35 70 Z M 22 45 L 15 55 M 28 45 L 35 55"
          stroke="#2C3E50"
          strokeWidth="2"
          fill="#2C3E50"
        />
        <path
           d="M75 90 C 70 70, 65 50, 65 30 L 70 30 C 70 50, 75 70, 80 90 Z M 67 40 L 55 50 M 73 40 L 85 50"
           stroke="#2C3E50"
           strokeWidth="2"
           fill="#2C3E50"
        />
        <circle cx="50" cy="65" r="8" fill="#FDE047" />
      </svg>
      <span className="ml-3 text-2xl font-bold tracking-tight">
        <span style={{ color: '#2C3E50', fontFamily: 'cursive' }}>Nity</span>
        <span style={{ color: '#F26D21', fontFamily: 'cursive' }}>Holiday</span>
      </span>
    </div>
  );
}
