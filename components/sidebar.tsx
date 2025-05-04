'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut } from 'lucide-react';

import { sidebarData, userProfile } from '@/data/static-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';
import { checkRoute } from '@/lib/utils';

export function AppSidebar() {
    const pathname = usePathname();
    const { setTheme, resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (checkRoute(pathname)) return null;

    return (
        <Sidebar className='border-r bg-background'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg'>
                            <div className='flex aspect-square size-8 items-center justify-center rounded-md border border-primary/10 bg-[#003346]'>
                                <Image src='/assets/logo.png' alt='Divyanshi Logo' width={512} height={512} className='w-3/5 h-3/5' />
                            </div>
                            <div className='flex flex-1 flex-col'>
                                <span className='font-semibold'>Divyanshi Fintech</span>
                                <span className='text-xs text-muted-foreground'>Loan Management System</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarData.platform.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`hover:bg-accent rounded-md transition-colors ${pathname === item.url ? 'bg-accent text-accent-foreground font-medium' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Loan</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarData.loan.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`hover:bg-accent rounded-md transition-colors ${pathname === item.url ? 'bg-accent text-accent-foreground font-medium' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Members</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarData.members.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`hover:bg-accent rounded-md transition-colors ${pathname === item.url ? 'bg-accent text-accent-foreground font-medium' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Invest</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarData.investments.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`hover:bg-accent rounded-md transition-colors ${pathname === item.url ? 'bg-accent text-accent-foreground font-medium' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Leads</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarData.lead.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`hover:bg-accent rounded-md transition-colors ${pathname === item.url ? 'bg-accent text-accent-foreground font-medium' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className='mt-auto'>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton size='lg' className='w-full hover:bg-accent rounded-md transition-colors'>
                                            <Avatar className='size-8'>
                                                <AvatarImage src='/placeholder.svg' alt={userProfile.name} />
                                                <AvatarFallback>
                                                    {userProfile.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='grid flex-1'>
                                                <span className='font-semibold'>{userProfile.name}</span>
                                                <span className='truncate text-xs text-muted-foreground'>{userProfile.role}</span>
                                            </div>
                                            <ChevronDown className='size-4 shrink-0 opacity-50' />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='start' alignOffset={-16} className='w-[--radix-dropdown-menu-trigger-width]'>
                                        {isMounted && (
                                            <DropdownMenuItem className='cursor-pointer flex items-center justify-between' onSelect={(e) => e.preventDefault()}>
                                                <span>Switch Theme</span>
                                                <Switch
                                                    checked={resolvedTheme === 'dark'}
                                                    onCheckedChange={(checked) => {
                                                        setTheme(checked ? 'dark' : 'light');
                                                    }}
                                                    aria-label='Toggle Dark Mode'
                                                    className='dark:bg-white'
                                                />
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                            <LogOut className='mr-2 size-4' />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
