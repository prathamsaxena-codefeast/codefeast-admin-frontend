'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut } from 'lucide-react';
import { checkRoute } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import roles from '@/constants/roles.json';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const ROLE_LABELS: Record<string, string> = roles;

  if (checkRoute(pathname)) return null;

  const roleLabel = user?.role ? ROLE_LABELS[user.role] || user.role : null;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-4 border-b bg-background px-4 lg:gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Welcome {user?.username || 'User'}</h1>
      </div>

      <div className="flex items-center gap-4">
        {roleLabel && (
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {roleLabel}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}