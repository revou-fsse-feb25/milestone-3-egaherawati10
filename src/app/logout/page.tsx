'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import LoadingSpinner from "../component/LoadingSpinner";

export default function LogoutPage(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false,
    }).then(() => {
      router.push("/login");
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <LoadingSpinner />
      <h1 className="text-2xl font-semibold mt-4">Logging you out...</h1>
      <p className="text-gray-600">You’ll be redirected to the login page shortly.</p>
    </div>
  );
}