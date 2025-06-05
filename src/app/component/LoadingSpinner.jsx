'use client';

import React from 'react';

export default function LoadingSpinner({
  fullScreen = false,
  size = 'md',
  message
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div
      className={`${spinnerSize} border-4 border-gray-500 border-t-gray-900 rounded-full animate-spin ease-linear`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
        {spinner}
        {message && <p className="text-gray-300 mt-4 text-sm">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10">
      {spinner}
      {message && <p className="text-gray-400 mt-4 text-sm">{message}</p>}
    </div>
  );
}
