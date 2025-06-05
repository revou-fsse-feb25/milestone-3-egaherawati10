// components/Header.js
import React from 'react';

export default function Header({ isLoggedIn, user }) {
  return (
    <header className="p-4 bg-gray-800 flex items-center justify-between">
      {isLoggedIn ? (
        <div className="profile flex items-center">
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="rounded-full w-10 h-10"
          />
          <span className="ml-2 text-white">{user.name}</span>
        </div>
      ) : (
        <button className="btn-login text-white bg-blue-600 px-4 py-2 rounded">
          Login
        </button>
      )}
    </header>
  );
}
