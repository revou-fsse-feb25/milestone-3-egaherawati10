"use client";

import { signOut, useSession } from "next-auth/react";
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
      router.replace("/profile"); // Redirect non-admins
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <main className="p-8">
      <NavBar session={session} />
    
    <section>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Sign Out
      </button>
      <Link
        href="/dashboard/products"
        className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded inline-block"
      >
        Manage Products
      </Link>
    </section>
    </main>
  );
}
