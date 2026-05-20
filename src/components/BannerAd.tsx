import React from 'react';

export function BannerAd() {
  return (
    <div className="w-full h-[50px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-700 shadow-sm mt-4 mb-2 overflow-hidden mx-auto max-w-sm rounded relative">
      <div className="absolute top-0 right-0 bg-black/40 text-white text-[9px] px-1 tracking-widest z-10">AD</div>
      <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm animate-pulse tracking-wide uppercase">
        Sponsored Content
      </p>
    </div>
  );
}
