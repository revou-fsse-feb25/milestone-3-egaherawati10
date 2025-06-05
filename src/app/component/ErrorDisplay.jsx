'use client';

import React from 'react';

export default function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="bg-red-900/30 border border-red-800 text-red-200 p-6 rounded-lg text-center max-w-2xl mx-auto my-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 mx-auto text-red-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-xl font-bold mb-3">Something went wrong</h2>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
