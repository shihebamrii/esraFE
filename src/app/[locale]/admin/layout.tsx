"use client";

import { AdminSidebar } from "@/features/admin/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/users": "Utilisateurs",
  "/admin/packs": "Packs",
  "/admin/playlists": "Listes de lecture",
  "/admin/content": "Impact — Contenus",
  "/admin/photos": "Tounesna — Photos",
  "/admin/orders": "Commandes",
  "/admin/inquiries": "Messages",
  "/admin/upload": "Téléverser",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("AdminDashboard.layout");
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role === "user") {
      router.replace("/user/dashboard");
    } else if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{t("hydrating")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{t("redirecting")}</p>
        </div>
      </div>
    );
  }

  // Determine current page title
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1];
  const matchKey = Object.keys(PAGE_TITLES).find((k) => pathname?.includes(k.split("/admin/")[1] || "dashboard"));
  const pageTitle = matchKey ? PAGE_TITLES[matchKey] : "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-background pt-14">
      <AdminSidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0 h-14">
          <div>
            <h2 className="text-sm font-semibold">{pageTitle}</h2>
          </div>
          
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
