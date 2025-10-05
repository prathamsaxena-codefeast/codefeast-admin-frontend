"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvidersContext } from "@/provider/theme-provider";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideSidebarAndHeader = ["/signup", "/login"].includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvidersContext>
            <SidebarProvider>
              {hideSidebarAndHeader ? (
                <main className="w-full h-screen">{children}</main>
              ) : (
                <div className="flex w-full h-screen">
                  {/* Sidebar */}
                  <AppSidebar />

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">{children}</main>
                  </div>
                </div>
              )}
            </SidebarProvider>
          </ThemeProvidersContext>
        </AuthProvider>
      </body>
    </html>
  );
}