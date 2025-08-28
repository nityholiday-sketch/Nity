import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center" title="Nityholiday">
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z" fill="#00A991"/>
        <path d="M24.246 10.68L18.498 19.344L14.4 15.246L6 24.18L13.158 31.338L16.29 27.888L21.858 31.758L30.93 18.006L24.246 10.68Z" fill="white" stroke="white" strokeWidth="0.5"/>
        <path d="M34.02 24.12L28.242 30L32.202 34.02L42 24.18L34.02 24.12Z" fill="white" stroke="white" strokeWidth="0.5"/>
      </svg>
      <span className="ml-2 font-headline text-xl font-bold">
        Nityholiday
      </span>
    </div>
  );
}
