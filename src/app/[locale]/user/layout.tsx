"use client";

import { UserSidebar } from "@/features/user/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    } else if (user?.role === 'admin') {
      router.replace("/admin/dashboard");
    } else if (user?.role !== 'user') {
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Animated loading screen
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse" />
            <div className="absolute inset-[3px] rounded-[9px] bg-background flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-2 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-2 w-16 rounded-full bg-muted animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Redirecting state
  if (!isAuthenticated || user?.role !== 'user') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
