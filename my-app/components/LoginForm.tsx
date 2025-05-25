'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
    onSubmit?: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Please complete all fields');
            return;
        }

        setIsLoading(true);

        try {
            // If there's a custom onSubmit function, use it
            if (onSubmit) {
                await onSubmit(username, password);
            } else {
                // First try to login
                const loginResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const loginResult = await loginResponse.json();

                if (loginResponse.ok) {
                    // Login successful
                    localStorage.setItem('username', username);
                    toast.success('Login successful!');
                    console.log('User authenticated:', loginResult.user);

                    setTimeout(() => {
                        router.push('/translator');
                    }, 1000);
                } else {
                    // Handle different types of errors
                    if (loginResult.error === 'USER_NOT_FOUND') {
                        // User doesn't exist, proceed with automatic registration
                        toast.info('User not found. Creating new account...');

                        const registerResponse = await fetch('/api/auth/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username, password }),
                        });

                        const registerResult = await registerResponse.json();

                        if (registerResponse.ok) {
                            localStorage.setItem('username', username);
                            toast.success('Account created and login successful!');
                            console.log('User registered and authenticated:', registerResult.user);

                            setTimeout(() => {
                                router.push('/translator');
                            }, 1000);
                        } else {
                            throw new Error(registerResult.error || 'Error creating account');
                        }
                    } else if (loginResult.error === 'INVALID_PASSWORD') {
                        // User exists but incorrect password
                        toast.error('Incorrect password');
                    } else {
                        // Other errors
                        throw new Error(loginResult.error || 'Error logging in');
                    }
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error instanceof Error ? error.message : 'Error logging in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Sign In
                </h2>
                <p className="text-gray-600 mt-2">Enter your credentials to access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="your_username"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="••••••••"
                        required
                    />
                </div>



                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>


        </div>
    );
};

export default LoginForm;