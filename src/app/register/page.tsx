'use client';

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    
    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulating registration
        console.log('Registered:', { email, password });
        alert('You are registered');
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <form onSubmit={handleRegister} 
                className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Register
                </h1>
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border rounded mb-3" />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border rounded mb-3" />

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {loading ? "Register your account..." : "Sign Up"}
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <p className="text-white text-center mt-2">
                    Already have an account? 
                    <a href="/login" className="text-blue-500 underline font-bold">
                    Log In
                    </a>
                </p>

            </form>
        </div>
    );
}