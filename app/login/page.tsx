'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LoginView } from './login-view';

export default function AuthPage() {
    return (
        <div className='min-h-screen grid lg:grid-cols-2 bg-background dark:bg-background'>
            {/* Left Section - Branding */}
            <div className='relative hidden lg:flex flex-col text-white p-12 bg-primary dark:bg-primary'>
                <div className='relative z-10 max-w-[520px] flex flex-col h-full'>
                    <Link href='/' className='mb-12'>
                        <Image src='/assets/logo.png' alt='Divyanshi Microfinance Logo' className='w-48 h-24 object-contain cursor-pointer' width={512} height={512} priority />
                    </Link>
                    <div className='flex-grow'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-8'>
                            Welcome to <br />
                            Divanshi Fintech
                        </h1>
                        <p className='text-lg md:text-xl opacity-90 max-w-md text-primary-foreground/80 dark:text-primary-foreground/80'>Empowering individuals and small businesses through innovative microfinance solutions. Discover our tailored loan offerings and achieve financial independence today.</p>
                    </div>
                    <div className='text-sm text-primary-foreground/70 dark:text-primary-foreground/70 mt-8'>© 2025 Divyanshi Microfinance. All rights reserved.</div>
                </div>

                <div className='absolute inset-0 overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-foreground/90 dark:from-primary/95 dark:via-primary/90 dark:to-primary-foreground/90' />

                    {/* Animated particles effect */}
                    <div className='absolute inset-0 opacity-30'>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className='absolute h-2 w-2 bg-primary-foreground rounded-full animate-pulse'
                                style={{
                                    top: `${25 * (i + 1)}%`,
                                    left: `${Math.random() * 80}%`,
                                    animationDelay: `${i * 0.5}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className='bg-background dark:bg-background flex flex-col justify-center items-center p-4 md:p-8'>
                <div className='w-full max-w-md flex items-center mb-6 px-4 md:px-0 justify-center '>
                    {/* Show logo on mobile */}
                    <div className='lg:hidden '>
                        <Image src='/assets/logo.png' alt='Divyanshi Microfinance Logo' className='w-32 h-20 object-contain ' width={512} height={512} priority />
                    </div>
                </div>

                <Suspense
                    fallback={
                        <div className='flex items-center justify-center w-full h-32'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary' />
                        </div>
                    }
                >
                    <LoginView />
                </Suspense>
            </div>
        </div>
    );
}
