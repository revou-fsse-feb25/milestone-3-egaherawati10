'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const success = email === 'user@example.com' && password === 'Password123';
            if (success) {
                toast.success('Login successful');
                // Set the cookie
                document.cookie = `auth_token=sampletoken; path=/;`;
                router.push('/dashboard');
                
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
}