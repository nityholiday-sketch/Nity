import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center" title="Nityholiday">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/nityholiday-adventures.firebasestorage.app/o/logo.png?alt=media&token=bec7bdc9-a77b-45ab-810e-74676d691a4e"
        alt="Nityholiday Logo"
        width={36}
        height={36}
      />
      <span className="ml-3 text-2xl font-bold tracking-tight">
        <span style={{ color: '#2C3E50', fontFamily: 'cursive' }}>Nity</span>
        <span style={{ color: '#F26D21', fontFamily: 'cursive' }}>Holiday</span>
      </span>
    </div>
  );
}
