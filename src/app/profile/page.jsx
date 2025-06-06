"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.role === "admin") {
      router.replace("/dashboard"); // 👈 Redirect admins away
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Sign Out
      </button>
    </main>
  );
}
