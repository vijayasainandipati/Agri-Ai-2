"use client";
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { LanguageSelector } from "@/components/language-selector";
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';

const DashboardSidebar = dynamic(
  () => import('@/components/dashboard-sidebar').then((mod) => mod.DashboardSidebar),
  {
    ssr: false,
    loading: () => <SidebarSkeletonLoader />
  }
);

function SidebarSkeletonLoader() {
  return (
    <div className="hidden md:block">
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2">
              <Icons.logo className="w-8 h-8 text-muted" />
              <Skeleton className="h-6 w-32" />
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {[...Array(8)].map((_, i) => <SidebarMenuSkeleton key={i} showIcon />)}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
          <Icons.logo className="w-16 h-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Page title can be dynamically set here */}
          </div>
          <LanguageSelector />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
