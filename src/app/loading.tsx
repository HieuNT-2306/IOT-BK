'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className='w-full h-[var(--100vh)] flex items-center justify-center fixed inset-0 z-[99999] bg-white flex-col gap-[0.5rem]'>
      Loading...
    </div>
  );
};

export default Loading;