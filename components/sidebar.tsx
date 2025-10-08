'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Mail, Users, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import sidebarConfig from '@/constants/sidebar-items.json';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`h-full border-r bg-background transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1">
          <Image
            src="/codefeast.svg"
            alt="codefeast"
            width={isCollapsed ? 16 : 64}
            height={16}
            className="transition-all duration-300"
          />
          {!isCollapsed && (
            <h1 className="text-sm font-semibold truncate">Codefeast Admin</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-accent transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isCollapsed ? '' : 'Leads'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarConfig.menuItems.map((item) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                  Mail,
                  Users,
                  UserPlus,
                } as const;
                const Icon = iconMap[item.icon] ?? Users;
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-accent ${
                      pathname === item.url
                        ? 'bg-accent text-accent-foreground font-medium'
                        : ''
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}