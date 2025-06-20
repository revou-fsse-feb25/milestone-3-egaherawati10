"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../component/NavBar"; 
import { Session } from "next-auth";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role === "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) return <p>Loading...</p>;

  return (
    <>
      <NavBar session={session as Session} />

      <main className="p-8">
        <section>
          <h1 className="text-3xl font-bold mb-4">User Profile</h1>
          <p>Welcome, {session.user.name}!</p>
        </section>
      </main>
    </>
  );
}
