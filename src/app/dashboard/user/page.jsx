"use client";

import React from "react";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Home
        </Link>
      </header>

      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">My Profile</h2>
          <p>View and update your personal information.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Edit Profile
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">My Orders</h2>
          <p>Track your orders and view order history.</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            View Orders
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Wishlist</h2>
          <p>Manage your wishlist items.</p>
          <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            View Wishlist
          </button>
        </div>
      </section>
    </main>
  );
}
