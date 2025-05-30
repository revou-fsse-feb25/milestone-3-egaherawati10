"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", { 
            email, 
            password, 
            redirect: false,
        });
        if (res.ok) {
            toast.success('Login successful');
            // Set the cookie
            // document.cookie = `auth_token=sampletoken; path=/;`;
            router.push("/dashboard");
                
        } else {
            toast.error('Invalid credentials');
        }
    };

    return (
        <main>
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
        </main>
    );
}