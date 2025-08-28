import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center" title="NityHoliday Adventures">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M2 7L12 12M22 7L12 12M12 22V12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M17 4.5L7 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2 font-headline text-xl font-bold text-primary">
        NityHoliday
      </span>
    </div>
  );
}
