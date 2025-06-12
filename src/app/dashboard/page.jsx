"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavBar } from "../component/NavBar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin") {
      router.replace("/profile");
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <>
      <NavBar session={session} />

      <main className="p-8">
        <section>
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p>Welcome, {session?.user?.name}!</p>

          <Link
            href="/dashboard/products"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Manage Products
          </Link>
        </section>
      </main>
    </>
  );
}
