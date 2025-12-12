'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/AuthModal';

import { Suspense } from 'react';

function LoginContent() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionExpired = searchParams.get('session') === 'expired';

    useEffect(() => {
        // Check if already logged in
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    router.push('/dashboard');
                }
            } catch (error) {
                // User not logged in, show modal
            }
        };
        checkAuth();
    }, [router]);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/');
    };

    return (
        <>
            {sessionExpired && (
                <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg z-50">
                    ⚠️ Tu sesión ha expirado. Alguien más inició sesión en esta cuenta.
                </div>
            )}

            <AuthModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initialMode="login"
            />
        </>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
            <Suspense fallback={<div className="animate-pulse bg-blue-100 rounded-lg h-32 w-32"></div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
