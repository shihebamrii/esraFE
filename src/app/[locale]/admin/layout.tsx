"use client";

import { AdminSidebar } from "@/features/admin/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("AdminDashboard.layout");
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log("AdminLayout Debug:", { 
      _hasHydrated, 
      isAuthenticated, 
      user, 
      userRole: user?.role 
    });

    if (!_hasHydrated) return;

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Redirect users with wrong role to their correct dashboard
    if (user?.role === 'user') {
      router.replace("/user/dashboard");
    } else if (user?.role !== 'admin') {
      // If no valid role, go home
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t("loading")}</h2>
          <p className="text-sm text-muted-foreground">{t("hydrating")}</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting (not authenticated or wrong role)
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t("redirecting")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
