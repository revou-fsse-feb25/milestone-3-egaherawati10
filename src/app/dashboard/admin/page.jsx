"use client";

import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Home
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p>View and manage all users.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Users
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Product Management</h2>
          <p>Add, edit, or remove products.</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Manage Products
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p>View and process orders.</p>
          <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            View Orders
          </button>
        </div>
      </section>
    </main>
  );
}
