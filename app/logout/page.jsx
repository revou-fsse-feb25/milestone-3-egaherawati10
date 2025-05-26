'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Clearing the cookie
        document.cookie = 'auth_token=; Max-Age=0; path=/';

        // Delay before redirecting to login page
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    }, [router]);

    return (
        <div>
            <h1>Logging you out...</h1>
            <p>You'll be redirected shortly</p>
        </div>
    );
}