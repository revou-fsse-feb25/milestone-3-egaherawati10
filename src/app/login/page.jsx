"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch users from Platzi API and check role
  const fetchUserRole = async (email) => {
    try {
      const res = await fetch("https://api.escuelajs.co/api/v1/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const users = await res.json();

      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) return null;

      // Assuming user object has a 'role' property; default to 'customer'
      return user.role || "customer";
    } catch (err) {
      console.error("Error fetching users:", err);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Fetch role from Platzi API before signing in
    const role = await fetchUserRole(email);

    if (!role) {
      setLoading(false);
      setError("User not found");
      toast.error("User not found");
      return;
    }

    // Proceed with signIn
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Login successful");

      // Redirect based on role fetched from API
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } else {
      setError("Invalid credentials");
      toast.error("Invalid credentials");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              "Login"
            )}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
