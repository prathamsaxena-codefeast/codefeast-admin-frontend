'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { checkRoute } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
    const { setTheme } = useTheme();
    const pathname = usePathname();

    // Hide the header on specific routes
    if (checkRoute(pathname)) return null;

    return (
        <div className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-4 border-b bg-background px-4 lg:gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Welcome Admin !</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="h-9 w-9">
                    DF
                </Button>
            </div>
        </div>
    );
}