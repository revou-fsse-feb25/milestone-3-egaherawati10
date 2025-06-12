'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import LoadingSpinner from "../component/LoadingSpinner";

export default function LogoutPage() {
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

// 'use client'

// import React from "react";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function LogoutPage() {
//     const router = useRouter();

//     useEffect(() => {
//         // Clearing the cookie
//         document.cookie = 'auth_token=; Max-Age=0; path=/';

//         // Delay before redirecting to login page
//         setTimeout(() => {
//             router.push('/login');
//         }, 1000);
//     }, [router]);

//     return (
//         <div>
//             <h1>Logging you out...</h1>
//             <p>You'll be redirected shortly</p>
//         </div>
//     );
// }