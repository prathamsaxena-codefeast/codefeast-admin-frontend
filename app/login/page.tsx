'use client';

import { Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LoginView } from './login-view';
import { redirect } from 'next/navigation';

export default function AuthPage() {

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            redirect('/contacts');
        }    
    },[]);

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <div className="relative hidden lg:flex flex-col p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-black" />
                <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="relative z-10 max-w-[520px] flex flex-col h-full mt-24 text-white">
                    <Link href="/" className="mb-12 inline-flex">
                        <Image
                            src="/codefeast.svg"
                            alt="codefeast"
                            className="w-48 h-24 object-contain cursor-pointer"
                            width={512}
                            height={512}
                            priority
                        />
                    </Link>
                    <div className="flex-grow">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Welcome to <br />
                            Codefeast Admin
                        </h1>
                        <p className="text-lg md:text-xl/relaxed opacity-90 max-w-md text-blue-100">
                            Manage your platform efficiently with our admin tools.
                        </p>
                    </div>
                    <div className="text-sm text-blue-100/80 mt-8">
                        © 2025 Codefeast. All rights reserved.
                    </div>
                </div>
            </div>

            <div className="bg-background flex flex-col justify-center items-center p-4 md:p-8">
                <div className="w-full max-w-md flex items-center mb-6 px-4 md:px-0 justify-center">
                    <div className="lg:hidden">
                        <Image
                            src="/codefeast.svg"
                            alt="codefeast"
                            className="w-32 h-20 object-contain"
                            width={512}
                            height={512}
                            priority
                        />
                    </div>
                </div>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center w-full h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    }
                >
                    <LoginView />
                </Suspense>
            </div>
        </div>
    );
}