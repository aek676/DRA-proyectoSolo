'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface Translation {
    _id: string;
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: string;
}

export default function HistorialPage() {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get user from localStorage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        if (!storedUsername) {
            toast.error('No authenticated user found');
            setIsLoading(false);
            return;
        }

        // Load history from API
        fetchHistory(storedUsername);
    }, []);

    const fetchHistory = async (userUsername: string) => {
        try {
            const response = await fetch(`/api/historial?username=${encodeURIComponent(userUsername)}`);

            if (!response.ok) {
                throw new Error('Error loading history');
            }

            const data = await response.json();

            if (data.success) {
                setTranslations(data.history);
            } else {
                throw new Error(data.error || 'Error loading history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Error loading history');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('username');
        toast.success('Session closed successfully');
        router.push('/login');
    };



    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Translation History
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Review all your previous translations
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 text-red-600"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16,17 21,12 16,7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Logout
                            </Button>
                            <Link href="/translator">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                    Back to Translator
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Content */}
                    {!username ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔒</div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                User not authenticated
                            </h2>
                            <p className="text-gray-500 mb-6">
                                You need to log in to view your history
                            </p>
                            <Link href="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            <span className="ml-3 text-gray-600">Loading history...</span>
                        </div>
                    ) : translations.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📚</div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                No translations in history
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Start translating to see your history here
                            </p>
                            <Link href="/translator">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Go to Translator
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {translations.map((translation) => (
                                <div
                                    key={translation._id}
                                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {translation.sourceLanguage.toUpperCase()} → {translation.targetLanguage.toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(translation.timestamp)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    📝 Original Text
                                                </h3>
                                                <div className="bg-gray-50 rounded-lg p-4 border">
                                                    <p className="text-gray-800 leading-relaxed">
                                                        {translation.originalText}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    🔄 Translation
                                                </h3>
                                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                    <p className="text-gray-800 leading-relaxed">
                                                        {translation.translatedText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(translation.originalText);
                                                    toast.success('Original text copied');
                                                }}
                                            >
                                                Copy Original
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(translation.translatedText);
                                                    toast.success('Translation copied');
                                                }}
                                            >
                                                Copy Translation
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
